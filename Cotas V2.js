#target Illustrator 

if (app.documents.length > 0) {

  // Document
  var doc = activeDocument;
  // Count selected items
  var selectedItems = parseInt(doc.selection.length, 10) || 0;

  /*----------  Defaults  ----------*/
  // Units
  var setUnits = true;
  var defaultUnits = $.getenv("Specify_defaultUnits") ? convertToBoolean($.getenv("Specify_defaultUnits")) : setUnits;
  // Font Size
  var setFontSize = 8;
  var defaultFontSize = $.getenv("Specify_defaultFontSize") ? convertToUnits($.getenv("Specify_defaultFontSize")).toFixed(3) : setFontSize;
  // Colors
  var setCyan = 0;
  var defaultColorCyan = $.getenv("Specify_defaultColorCyan") ? $.getenv("Specify_defaultColorCyan") : setCyan;
  var setMagenta = 100;
  var defaultColorMagenta = $.getenv("Specify_defaultColorMagenta") ? $.getenv("Specify_defaultColorMagenta") : setMagenta;
  var setYellow = 0;
  var defaultColorYellow = $.getenv("Specify_defaultColorYellow") ? $.getenv("Specify_defaultColorYellow") : setYellow;
  var setBlack = 0;
  var defaultColorBlack = $.getenv("Specify_defaultColorBlack") ? $.getenv("Specify_defaultColorBlack") : setBlack;
  // Decimals
  var setDecimals = 2;
  var defaultDecimals = $.getenv("Specify_defaultDecimals") ? $.getenv("Specify_defaultDecimals") : setDecimals;

  /*=====================================
  =            Create Dialog            =
  =====================================*/

  // Dialog Box
  var specifyDialogBox = new Window("dialog", "Cotas");
  specifyDialogBox.alignChildren = "left";

  // Dimension panel
  dimensionPanel = specifyDialogBox.add("panel", undefined, "Selecionar Posición de Cotas");
  dimensionPanel.orientation = "column";
  dimensionPanel.alignment = "fill";
  dimensionPanel.margins = [20, 20, 20, 10];

  /*----------  Dimension Panel  ----------*/
  dimensionGroup = dimensionPanel.add("group");
  dimensionGroup.orientation = "row";

  // Arriba
  (topCheckbox = dimensionGroup.add("checkbox", undefined, "Arriba")).helpTip = "Dimension the top side of the object(s).";
  topCheckbox.value = false;

  // Derecha
  (rightCheckbox = dimensionGroup.add("checkbox", undefined, "Derecha")).helpTip = "Dimension the right side of the object(s).";
  rightCheckbox.value = false;

  // Abajo
  (bottomCheckbox = dimensionGroup.add("checkbox", undefined, "Abajo")).helpTip = "Dimension the bottom side of the object(s).";
  bottomCheckbox.value = false;

  // Izquierda
  (leftCheckbox = dimensionGroup.add("checkbox", undefined, "Izquierda")).helpTip = "Dimension the left side of the object(s).";
  leftCheckbox.value = false;

  /*----------  Select All  ----------*/
  selectAllGroup = dimensionPanel.add("group");
  selectAllGroup.orientation = "row";

  (selectAllCheckbox = selectAllGroup.add("checkbox", undefined, "Seleccionar Todo")).helpTip = "Dimension all sides of the object(s).";
  selectAllCheckbox.value = false;
  selectAllCheckbox.onClick = function () {
    if (selectAllCheckbox.value) {
      // Select All is checked
      topCheckbox.value = true;
      topCheckbox.enabled = false;

      rightCheckbox.value = true;
      rightCheckbox.enabled = false;

      bottomCheckbox.value = true;
      bottomCheckbox.enabled = false;

      leftCheckbox.value = true;
      leftCheckbox.enabled = false;
    } else {
      // Select All is unchecked
      topCheckbox.value = false;
      topCheckbox.enabled = true;

      rightCheckbox.value = false;
      rightCheckbox.enabled = true;

      bottomCheckbox.value = false;
      bottomCheckbox.enabled = true;

      leftCheckbox.value = false;
      leftCheckbox.enabled = true;
    }
  }

  /*----------  Panel de Opciones  ----------*/
  optionsPanel = specifyDialogBox.add("panel", undefined, "Opciones");
  optionsPanel.orientation = "column";
  optionsPanel.margins = 20;
  optionsPanel.alignChildren = "left";

  // Add options panel checkboxes
  (units = optionsPanel.add("checkbox", undefined, "Incluir Unidades")).helpTip = "When checked, inserts the units label alongside\nthe outputted dimension.\nExample: 220 px";
  units.value = defaultUnits;

  // If exactly 2 objects are selected, give user option to dimension BETWEEN them
  if (selectedItems == 2) {
    (between = optionsPanel.add("checkbox", undefined, "Distancia entra Objetos")).helpTip = "When checked, return the distance between\nthe 2 objects for the selected dimensions.";
    between.value = false;
  }

  // Add font-size box
  fontGroup = optionsPanel.add("group");
  fontGroup.orientation = "row";
  fontLabel = fontGroup.add("statictext", undefined, "Tamaño de Fuente:");
  (fontSizeInput = fontGroup.add("edittext", undefined, defaultFontSize)).helpTip = "Enter the desired font size for the dimension label(s).\nDefault: " + setFontSize;
  fontUnitsLabelText = "";
  switch (doc.rulerUnits) {
      case RulerUnits.Picas:
          fontUnitsLabelText = "pc";
          break;
      case RulerUnits.Inches:
          fontUnitsLabelText = "in";
          break;
      case RulerUnits.Millimeters:
          fontUnitsLabelText = "mm";
          break;
      case RulerUnits.Centimeters:
          fontUnitsLabelText = "cm";
          break;
      case RulerUnits.Pixels:
          fontUnitsLabelText = "px";
          break;
      default:
          fontUnitsLabelText = "pt";
  }
  fontUnitsLabel = fontGroup.add("statictext", undefined, fontUnitsLabelText);
  fontSizeInput.characters = 5;
  fontSizeInput.onActivate = function () {
      restoreDefaultsButton.enabled = true;
  }

  /*----------  Add color group  ----------*/
  colorGroup = optionsPanel.add("group");
  colorGroup.orientation = "row";
  colorLabel = colorGroup.add("statictext", undefined, "Cor (CMYK):");
  // Cyan
  (colorInputCyan = colorGroup.add("edittext", undefined, defaultColorCyan)).helpTip = "Enter the CMYK Cyan color value to use for dimension label(s).\nDefault: " + setCyan;
  colorInputCyan.characters = 3;
  // Magenta
  (colorInputMagenta = colorGroup.add("edittext", undefined, defaultColorMagenta)).helpTip = "Enter the CMYK Magenta color value to use for dimension label(s).\nDefault: " + setMagenta;
  colorInputMagenta.characters = 3;
  // Yellow
  (colorInputYellow = colorGroup.add("edittext", undefined, defaultColorYellow)).helpTip = "Enter the CMYK Yellow color value to use for dimension label(s).\nDefault: " + setYellow;
  colorInputYellow.characters = 3;
  // Black
  (colorInputBlack = colorGroup.add("edittext", undefined, defaultColorBlack)).helpTip = "Enter the CMYK Black color value to use for dimension label(s).\nDefault: " + setBlack;
  colorInputBlack.characters = 3;

  colorInputCyan.onActivate = function () {
      restoreDefaultsButton.enabled = true;
  }
  colorInputMagenta.onActivate = function () {
      restoreDefaultsButton.enabled = true;
  }
  colorInputYellow.onActivate = function () {
      restoreDefaultsButton.enabled = true;
  }
  colorInputBlack.onActivate = function () {
      restoreDefaultsButton.enabled = true;
  }

  // Add decimal places box
  decimalPlacesGroup = optionsPanel.add("group");
  decimalPlacesGroup.orientation = "row";
  decimalPlacesLabel = decimalPlacesGroup.add("statictext", undefined, "Decimales:");
  (decimalPlacesInput = decimalPlacesGroup.add("edittext", undefined, defaultDecimals)).helpTip = "Enter the desired number of decimal places to\ndisplay in the label dimensions.\nDefault: " + setDecimals;
  decimalPlacesInput.characters = 4;
  decimalPlacesInput.onActivate = function () {
      restoreDefaultsButton.enabled = true;
  }

  // Info text
  infoText = optionsPanel.add("statictext", undefined, "Las opciones son persistentes hasta que se cierre la aplicación");
  infoText.margins = 20;
  // Disable to make text appear subtle
  infoText.enabled = false;

  // Reset options button
  restoreDefaultsButton = optionsPanel.add("button", undefined, "Restaurar Preferencias");
  restoreDefaultsButton.alignment = "left";
  restoreDefaultsButton.enabled = (setFontSize != defaultFontSize || setCyan != defaultColorCyan || setMagenta != defaultColorMagenta || setYellow != defaultColorYellow || setBlack != defaultColorBlack || setDecimals != defaultDecimals ? true : false);
  restoreDefaultsButton.onClick = function () {
    restoreDefaults();
  }

  function restoreDefaults() {
    units.value = setUnits;
    fontSizeInput.text = setFontSize;
    colorInputCyan.text = setCyan;
    colorInputMagenta.text = setMagenta;
    colorInputYellow.text = setYellow;
    colorInputBlack.text = setBlack;
    decimalPlacesInput.text = setDecimals;
    restoreDefaultsButton.enabled = false;
    // Unset environmental variables
    $.setenv("Specify_defaultUnits", "");
    $.setenv("Specify_defaultFontSize", "");
    $.setenv("Specify_defaultColorCyan", "");
    $.setenv("Specify_defaultColorMagenta", "");
    $.setenv("Specify_defaultColorYellow", "");
    $.setenv("Specify_defaultColorBlack", "");
    $.setenv("Specify_defaultDecimals", "");
  }

  /*----------  Button Group  ----------*/
  buttonGroup = specifyDialogBox.add("group");
  buttonGroup.orientation = "row";
  buttonGroup.alignment = "right";
  buttonGroup.margins = [20, 0, 20, 20]; // [left, top, right, bottom]

  // Cancel button
  cancelButton = buttonGroup.add("button", undefined, "Cancelar");
  cancelButton.onClick = function () {
    specifyDialogBox.close();
  }

  // Specify button
  specifyButton = buttonGroup.add("button", undefined, "Aplicar Cotas");
  specifyButton.size = [125, 40];
  specifyDialogBox.defaultElement = specifyButton;
  specifyButton.onClick = function () {
    startSpec();
  }

  /*=====  End of Create Dialog  ======*/

  // SPEC layer
  try {
    var specsLayer = doc.layers["Dimension Layer"];
  } catch (err) {
    var specsLayer = doc.layers.add();
    specsLayer.name = "Dimension Layer";
  }

  // measurement line and text in CMYK color
  var color = new CMYKColor;
  color.cyan = defaultColorCyan;
  color.magenta = defaultColorMagenta;
  color.yellow = defaultColorYellow;
  color.black = defaultColorBlack;

  // Declare global decimals var
  var decimals;

  // Gap between measurement lines and object
  var gap = 4;

  // Size of perpendicular measurement lines.
  var size = 6;

  // Start the spec
  function startSpec() {

    // Add all selected objects to array
    var objectsToSpec = new Array();
    for (var index = doc.selection.length - 1; index >= 0; index--) {
      objectsToSpec[index] = doc.selection[index];
    }

    // Fetch desired dimensions
    var top = topCheckbox.value;
    var left = leftCheckbox.value;
    var right = rightCheckbox.value;
    var bottom = bottomCheckbox.value;
    // Take focus away from fontSizeInput to validate (numeric)
    fontSizeInput.active = false;

    // Set bool for numeric vars
    var validFontSize = /^[0-9]{1,3}(\.[0-9]{1,3})?$/.test(fontSizeInput.text);

    var validCyanColor = /^[0-9]{1,3}$/.test(colorInputCyan.text);
    var validMagentaColor = /^[0-9]{1,3}$/.test(colorInputMagenta.text);
    var validYellowColor = /^[0-9]{1,3}$/.test(colorInputYellow.text);
    var validBlackColor = /^[0-9]{1,3}$/.test(colorInputBlack.text);
    // If colors are valid, set variables
    if (validCyanColor && validMagentaColor && validYellowColor && validBlackColor) {
      color.Cyan = colorInputCyan.text;
      color.Magenta = colorInputMagenta.text;
      color.Yellow = colorInputYellow.text;
      color.Black = colorInputBlack.text;
      // Set environmental variables
      $.setenv("Specify_defaultColorCyan", color.Cyan);
      $.setenv("Specify_defaultColorMagenta", color.Magenta);
      $.setenv("Specify_defaultColorYellow", color.Yellow);
      $.setenv("Specify_defaultColorBlack", color.Black);
    }

    var validDecimalPlaces = /^[0-4]{1}$/.test(decimalPlacesInput.text);
    if (validDecimalPlaces) {
      // Number of decimal places in measurement
      decimals = decimalPlacesInput.text;
      // Set environmental variable
      $.setenv("Specify_defaultDecimals", decimals);
    }

    if (selectedItems < 1) {
      beep();
      alert("Por favor Selecione ao menos 1 objeto e tente novamente.");
      // Close dialog
      specifyDialogBox.close();
    } else if (!top && !left && !right && !bottom) {
      beep();
      alert("Please select at least 1 dimension to draw.");
    } else if (!validFontSize) {
      // If fontSizeInput.text does not match regex
      beep();
      alert("Please enter a valid font size. \n0.002 - 999.999");
      fontSizeInput.active = true;
      fontSizeInput.text = setFontSize;
    } else if (parseFloat(fontSizeInput.text, 10) <= 0.001) {
      beep();
      alert("Font size must be greater than 0.001.");
      fontSizeInput.active = true;
    } else if (!validCyanColor || !validMagentaColor || !validYellowColor || !validBlackColor) {
      // If CMYK inputs are not numeric
      beep();
      alert("Please enter a valid CMYKColor.");
      colorInputCyan.active = true;
      colorInputCyan.text = defaultColorCyan;
      colorInputMagenta.text = defaultColorMagenta;
      colorInputYellow.text = defaultColorYellow;
      colorInputBlack.text = defaultColorBlack;
    } else if (!validDecimalPlaces) {
      // If decimalPlacesInput.text is not numeric
      beep();
      alert("Decimal places must range from 0 - 4.");
      decimalPlacesInput.active = true;
      decimalPlacesInput.text = setDecimals;
    } else if (selectedItems == 2 && between.value) {
      if (top) specDouble(objectsToSpec[0], objectsToSpec[1], "Top");
      if (left) specDouble(objectsToSpec[0], objectsToSpec[1], "Left");
      if (right) specDouble(objectsToSpec[0], objectsToSpec[1], "Right");
      if (bottom) specDouble(objectsToSpec[0], objectsToSpec[1], "Bottom");
      // Close dialog when finished
      specifyDialogBox.close();
    } else {
      // Iterate over each selected object, creating individual dimensions as you go
      for (var objIndex = objectsToSpec.length - 1; objIndex >= 0; objIndex--) {
        if (top) specSingle(objectsToSpec[objIndex].geometricBounds, "Top");
        if (left) specSingle(objectsToSpec[objIndex].geometricBounds, "Left");
        if (right) specSingle(objectsToSpec[objIndex].geometricBounds, "Right");
        if (bottom) specSingle(objectsToSpec[objIndex].geometricBounds, "Bottom");
      }
      // Close dialog when finished
      specifyDialogBox.close();
    }
  }

  // Spec a single object
  function specSingle(bound, where) {
    // unlock SPECS layer
    specsLayer.locked = false;

    // width and height
    var w = bound[2] - bound[0];
    var h = bound[1] - bound[3];

    // a & b are the horizontal or vertical positions that change
    // c is the horizontal or vertical position that doesn't change
    var a = bound[0];
    var b = bound[2];
    var c = bound[1];

    // xy='x' (horizontal measurement), xy='y' (vertical measurement)
    var xy = "x";

    // a direction flag for placing the measurement lines.
    var dir = 1;

    switch (where) {
      case "Top":
        a = bound[0];
        b = bound[2];
        c = bound[1];
        xy = "x";
        dir = 1;
        break;
      case "Right":
        a = bound[1];
        b = bound[3];
        c = bound[2];
        xy = "y";
        dir = 1;
        break;
      case "Bottom":
        a = bound[0];
        b = bound[2];
        c = bound[3];
        xy = "x";
        dir = -1;
        break;
      case "Left":
        a = bound[1];
        b = bound[3];
        c = bound[0];
        xy = "y";
        dir = -1;
        break;
    }

    // Create the measurement lines
    var lines = new Array();

    // horizontal measurement
    if (xy == "x") {

      // 2 vertical lines
      lines[0] = new Array(new Array(a, c + (gap) * dir));
      lines[0].push(new Array(a, c + (gap + size) * dir));
      lines[1] = new Array(new Array(b, c + (gap) * dir));
      lines[1].push(new Array(b, c + (gap + size) * dir));

      // 1 horizontal line
      lines[2] = new Array(new Array(a, c + (gap + size / 2) * dir));
      lines[2].push(new Array(b, c + (gap + size / 2) * dir));

      // Create text label
      if (where == "Top") {
        var t = specLabel(w, (a + b) / 2, lines[0][1][1], color);
        t.top += t.height;
      } else {
        var t = specLabel(w, (a + b) / 2, lines[0][0][1], color);
        t.top -= size;
      }
      t.left -= t.width / 2;

    } else {
      // Vertical measurement

      // 2 horizontal lines
      lines[0] = new Array(new Array(c + (gap) * dir, a));
      lines[0].push(new Array(c + (gap + size) * dir, a));
      lines[1] = new Array(new Array(c + (gap) * dir, b));
      lines[1].push(new Array(c + (gap + size) * dir, b));

      //1 vertical line
      lines[2] = new Array(new Array(c + (gap + size / 2) * dir, a));
      lines[2].push(new Array(c + (gap + size / 2) * dir, b));

      // Create text label
      if (where == "Left") {
        var t = specLabel(h, lines[0][1][0], (a + b) / 2, color);
        t.left -= t.width;
        t.rotate(90, true, false, false, false, Transformation.BOTTOMRIGHT);
        t.top += t.width;
        t.top += t.height / 2;
      } else {
        var t = specLabel(h, lines[0][1][0], (a + b) / 2, color);
        t.rotate(-90, true, false, false, false, Transformation.BOTTOMLEFT);
        t.top += t.width;
        t.top += t.height / 2;
      }
    }

    // Draw lines
    var specgroup = new Array(t);

    for (var i = 0; i < lines.length; i++) {
      var p = doc.pathItems.add();
      p.setEntirePath(lines[i]);
      p.strokeDashes = []; // Prevent dashed SPEC lines
      setLineStyle(p, color);
      specgroup.push(p);
    }

    group(specsLayer, specgroup);

    // re-lock SPECS layer
    specsLayer.locked = false;

  }

  // Spec the gap between 2 elements
  function specDouble(item1, item2, where) {

    var bound = new Array(0, 0, 0, 0);

    var a = item1.geometricBounds;
    var b = item2.geometricBounds;

    if (where == "Top" || where == "Bottom") {

      if (b[0] > a[0]) { // item 2 on right,

        if (b[0] > a[2]) { // no overlap
          bound[0] = a[2];
          bound[2] = b[0];
        } else { // overlap
          bound[0] = b[0];
          bound[2] = a[2];
        }
      } else if (a[0] >= b[0]) { // item 1 on right

        if (a[0] > b[2]) { // no overlap
          bound[0] = b[2];
          bound[2] = a[0];
        } else { // overlap
          bound[0] = a[0];
          bound[2] = b[2];
        }
      }

      bound[1] = Math.max(a[1], b[1]);
      bound[3] = Math.min(a[3], b[3]);

    } else {

      if (b[3] > a[3]) { // item 2 on top
        if (b[3] > a[1]) { // no overlap
          bound[3] = a[1];
          bound[1] = b[3];
        } else { // overlap
          bound[3] = b[3];
          bound[1] = a[1];
        }
      } else if (a[3] >= b[3]) { // item 1 on top

        if (a[3] > b[1]) { // no overlap
          bound[3] = b[1];
          bound[1] = a[3];
        } else { // overlap
          bound[3] = a[3];
          bound[1] = b[1];
        }
      }

      bound[0] = Math.min(a[0], b[0]);
      bound[2] = Math.max(a[2], b[2]);
    }
    specSingle(bound, where);
  }

  // Create a text label that specify the dimension
  function specLabel(val, x, y, color) {

    var t = doc.textFrames.add();
    // Get font size from specifyDialogBox.fontSizeInput
    var labelFontSize;
    if (parseFloat(fontSizeInput.text) > 0) {
      labelFontSize = parseFloat(fontSizeInput.text);
    } else {
      labelFontSize = defaultFontSize;
    }

    // Convert font size to RulerUnits
    var labelFontInUnits = convertToPoints(labelFontSize);

    // Set environmental variable
    $.setenv("Specify_defaultFontSize", labelFontInUnits);

    t.textRange.characterAttributes.size = labelFontInUnits;
    t.textRange.characterAttributes.alignment = StyleRunAlignmentType.center;
    t.textRange.characterAttributes.fillColor = color;

    // Conversions : http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/illustrator/sdk/CC2014/Illustrator%20Scripting%20Guide.pdf
    // UnitValue object (page 230): http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/scripting/pdfs/javascript_tools_guide.pdf

    var displayUnitsLabel = units.value;
    // Set environmental variable
    $.setenv("Specify_defaultUnits", displayUnitsLabel);

    var v = val;
    var unitsLabel = "";

    switch (doc.rulerUnits) {
        case RulerUnits.Picas:
          v = new UnitValue(v, "pt").as("pc");
          var vd = v - Math.floor(v);
          vd = 12 * vd;
          v = Math.floor(v) + "p" + vd.toFixed(decimals);
          break;
        case RulerUnits.Inches:
          v = new UnitValue(v, "pt").as("in");
          v = v.toFixed(decimals);
          unitsLabel = " in"; // add abbreviation
          break;
        case RulerUnits.Millimeters:
          v = new UnitValue(v, "pt").as("mm");
          v = v.toFixed(decimals);
          unitsLabel = " mm"; // add abbreviation
          break;
        case RulerUnits.Centimeters:
          v = new UnitValue(v, "pt").as("cm");
          v = v.toFixed(decimals);
          unitsLabel = " cm"; // add abbreviation
          break;
        case RulerUnits.Pixels:
          v = new UnitValue(v, "pt").as("px");
          v = v.toFixed(decimals);
          unitsLabel = " px"; // add abbreviation
          break;
        default:
          v = new UnitValue(v, "pt").as("pt");
          v = v.toFixed(decimals);
          unitsLabel = " pt"; // add abbreviation
    }

    if (displayUnitsLabel) {
      t.contents = v + unitsLabel;
    } else {
      t.contents = v;
    }
    t.top = y;
    t.left = x;

    return t;
  }

  function convertToBoolean(string) {
    switch(string.toLowerCase()) {
        case "true":
            return true;
            break;
        case "false":
            return false;
            break;
    }
  }

  function setLineStyle(path, color) {
    path.filled = false;
    path.stroked = true;
    path.strokeColor = color;
    path.strokeWidth = 0.5;
    return path;
  }

  // Group items in a layer
  function group(layer, items, isDuplicate) {

    // Create new group
    var gg = layer.groupItems.add();

    // Add to group
    // Reverse count, because items length is reduced as items are moved to new group
    for (var i = items.length - 1; i >= 0; i--) {

      if (items[i] != gg) { // don't group the group itself
        if (isDuplicate) {
          newItem = items[i].duplicate(gg, ElementPlacement.PLACEATBEGINNING);
        } else {
          items[i].move(gg, ElementPlacement.PLACEATBEGINNING);
        }
      }
    }
    return gg;
  }

  function convertToPoints(value) {
      switch (doc.rulerUnits) {
          case RulerUnits.Picas:
              value = new UnitValue(value, "pc").as("pt");
              break;
          case RulerUnits.Inches:
              value = new UnitValue(value, "in").as("pt");
              break;
          case RulerUnits.Millimeters:
              value = new UnitValue(value, "mm").as("pt");
              break;
          case RulerUnits.Centimeters:
              value = new UnitValue(value, "cm").as("pt");
              break;
          case RulerUnits.Pixels:
              value = new UnitValue(value, "px").as("pt");
              break;
          default:
              value = new UnitValue(value, "pt").as("pt");
      }
      return value;
  }

  function convertToUnits(value) {
      switch (doc.rulerUnits) {
          case RulerUnits.Picas:
              value = new UnitValue(value, "pt").as("pc");
              break;
          case RulerUnits.Inches:
              value = new UnitValue(value, "pt").as("in");
              break;
          case RulerUnits.Millimeters:
              value = new UnitValue(value, "pt").as("mm");
              break;
          case RulerUnits.Centimeters:
              value = new UnitValue(value, "pt").as("cm");
              break;
          case RulerUnits.Pixels:
              value = new UnitValue(value, "pt").as("px");
              break;
          default:
              value = new UnitValue(value, "pt").as("pt");
      }
      return value;
  }

  /*
   ** ======================================
   ** RUN SCRIPT
   ** ======================================
   */
  switch (selectedItems) {
    case 0:
      beep();
      alert("Selecionar 1 Objeto para aplicar cotas.");
      break;
    default:
      specifyDialogBox.show();
      break;
  }

} else { // No active document
  alert("There are no objects to Specify. \nPlease open a document to continue.")
}