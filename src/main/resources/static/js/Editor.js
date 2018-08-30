
/*Se crea una clase en javascript*/	
var Editor = Editor ||{
	/*Inicialización de la clase*/
	init: function(){
		Editor.initEvents();
	},	
	
	initEvents: function(){		
		//Eventos fundamentales del editor
		$("#table1").keyup(function(e){
			var html = Editor.processText($(this).html());
			$("#table2").html(html);
			$("#table1").trigger("scroll");
		});		
		
		$('#table1').on('keydown .editable', function(e){
			if (e.keyCode == 9) {
				Editor.insertTab();
				e.preventDefault();
			}
		});
		
		$("#table1").scroll(function() {
			$("#table2").prop("scrollTop", this.scrollTop);
			$("#table2").prop("scrollLeft", this.scrollLeft);
		});
		
		$("#table1").bind('paste cut copy', function(e) {
			e.preventDefault();
		}); 
		
		//Evento para el cambio de style
		$("#selectStyle").change(function(){
			if($(this).val() == "Dark"){
				$("#table2,#outputDiv").addClass("themeDark").removeClass("themeLight");
				$("#barTools").addClass("barToolsThemeDark").removeClass("barToolsThemeLight");
				$("#barToolsOutput").addClass("barToolsOutputThemeDark").removeClass("barToolsOutputThemeLight");
				$("#resultPalette").addClass("resultPaletteDark").removeClass("resultPaletteLight");
				$(".actions").addClass("actionsDark").removeClass("actionsLight");
				$("#table1").css("caret-color", "whitesmoke");
				$('[data-lines]').attr("data-lines", "linesDark");
				if($("#resultPalette").is(":visible")){
					$("#actionPalette").addClass("actionPaletteDark").removeClass("actionPaletteLight");
				}							
			}
			else{
				$("#table2,#outputDiv").addClass("themeLight").removeClass("themeDark");
				$("#barTools").addClass("barToolsThemeLight").removeClass("barToolsThemeDark");
				$("#barToolsOutput").addClass("barToolsOutputThemeLight").removeClass("barToolsOutputThemeDark");
				$("#resultPalette").addClass("resultPaletteLight").removeClass("resultPaletteDark");
				$(".actions").addClass("actionsLight").removeClass("actionsDark");
				$("#table1").css("caret-color", "black");
				$('[data-lines]').attr("data-lines", "linesLight");
				if($("#resultPalette").is(":visible")){
					$("#actionPalette").addClass("actionPaletteLight").removeClass("actionPaletteDark");
				}	
			}
			$("#table1").trigger("keyup");
			$("#actionPalette").trigger("click");
		});
		
		//Evento para el cambio de font
		$("#selectFont").change(function(){
			$("#table2,#table1").css("font-family", $(this).val());
			$("#actionPalette").trigger("click");
		});
		//Evento para el cambio de size font
		$("#selectSize").change(function(){
			$("#selectSizeValue").text($(this).val());
			$("#table2,#table1").css("font-size", $(this).val()+"px");
			$("#actionPalette").trigger("click");
		});
		
		$("#selectStyle").trigger("change");
		$("#selectFont").trigger("change");
		$("#selectSize").trigger("change");
		
		//Eventos de la barra de tools		
		$("#actionPalette").click(function(e){
			$("#selectStyle").val() == "Dark" ? $("#actionPalette").addClass("actionPaletteDark").removeClass("actionPaletteLight") : $("#actionPalette").addClass("actionPaletteLight").removeClass("actionPaletteDark");
			if($("#resultPalette").is(":visible")){
				$("#actionPalette").removeClass("actionPaletteDark").removeClass("actionPaletteLight");
			}			
			$("#resultPalette").slideToggle("slow");
			e.stopPropagation();
		});
		
		$("#resultPalette").click(function(e){
			e.stopPropagation();
		});
		
		$(".palette").click(function(e){
			$("#resultPalette").slideUp("slow");
			$("#actionPalette").removeClass("actionPaletteDark").removeClass("actionPaletteLight");
			e.stopPropagation();			
		});
		
		//Delete content
		$("#actionTrash").click(function(){
			var message = '<div class="container-fluid">' + "Do you want to delete the written text?" + '</div>';
			Editor.dialog("Delete", message, Editor.deleteText, true);
		});
		
		//Save content
		$("#actionSave").click(function(){
			Editor.saveText($("#table1").text());
		});
		
		//Upload content
		$("#actionUpload").click(function(){
			var message = '<form><div class="container-fluid"><input type="file" class="form-control-file" id="fileName"></div></form>';
			Editor.dialog("Load file", message, Editor.loadFile, true, Editor.eventBeforeChangeFile);
		});
		
		//Lock content
		$("#actionLock").click(function(){
			if($("#actionLock i").hasClass("fa-unlock")){
				$("#actionLock i").removeClass("fa-unlock").addClass("fa-lock");
				$("#table1").attr("contenteditable", "false");
				$(this).attr("data-title", "Unlock");
			}
			else{
				$("#actionLock i").removeClass("fa-lock").addClass("fa-unlock");
				$("#table1").attr("contenteditable", "true");
				$(this).attr("data-title", "Lock");
			}
		});
		
		$("#actionViewOutput").click(function(){
			if($("#actionViewOutput i").hasClass("fa-angle-double-up")){
				$("#actionViewOutput i").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
				$(this).attr("data-title", "Show Output");
			}
			else{
				$("#actionViewOutput i").removeClass("fa-angle-double-down").addClass("fa-angle-double-up");
				$(this).attr("data-title", "Hide Output");
			}
			$("#outputDiv").slideToggle("slow");
			$("#barToolsOutput").slideToggle("slow");
		});
		
		$("#actionCleanOutput").click(function(){
			$("#outputDiv").html("");
		});
	},
	
	processText:function(html){
		var styles = Editor.stylesPredefined();		
		//Add lines
		var linesStyle = $("#selectStyle").val() == "Dark" ? "linesDark" : "linesLight";
		var lines = html.match(/<div>/g);
		var	lastPosition = 0;
		if(lines != null){
			html = html.indexOf("<div>") == 0 ? html : "<span data-lines='"+ linesStyle +"'>1</span>" + html.substring(0, html.length);
			var step = html.indexOf("<div>") == 0 ? 1 : 2;
			for(var i=0; i< lines.length; i++){
				var value = i + step;
				var found = html.indexOf("<div>", lastPosition);
				var firstPart = html.substring(0, found + 5);
				var replacePart = "<span data-lines='"+linesStyle+"'>"+ value +"</span>";
				var endPart = html.substring(found + 5);
				html = firstPart + replacePart + endPart;
				lastPosition = found + replacePart.length;
			}
		}
		else{
			html = "<div><span data-lines='"+linesStyle+"'>1</span>" + html.substring(0, html.length) + "</div>";
		}
		//Replace reserved words
		for(var i = 0; i < styles.length; i++){	
			html = html.replace(new RegExp('(?<![\\w\\d])' + styles[i].id + '(?![\\w\\d])', 'g'), "<span style='" + styles[i].style + "'>"+styles[i].id+"</span>");
		}
		return html;
	},
	
	insertTab:function(){
		if (!window.getSelection) return;
		  const sel = window.getSelection();
		  if (!sel.rangeCount) return;
		  const range = sel.getRangeAt(0);
		  range.collapse(true);
		  const span = document.createElement('span');
		  span.appendChild(document.createTextNode('\t'));
		  span.style.whiteSpace = 'pre';
		  range.insertNode(span);
		  range.setStartAfter(span);
		  range.collapse(true);
		  sel.removeAllRanges();
		  sel.addRange(range);
	},
	
	dialog: function(title, content, doAccept, doCancel, eventBefore){
		var buttons = [];
		var buttonAccept = doAccept ? {id: "aceptarButton", label: 'Ok', action: function() { doAccept(dialog); dialog.close();}} : "";
		var buttonCancel = doAccept ? {label: 'Cancel', action: function() { dialog.close();}} : "";
		if(buttonAccept != "")
			buttons.push(buttonAccept);
		if(buttonCancel != "")
			buttons.push(buttonCancel);
		
		var dialog = new BootstrapDialog({
				title: title,
				type: BootstrapDialog.TYPE_DANGER,
				message: $(content),
				closeByBackdrop: false,
				closeByKeyboard: false,
				buttons: buttons
			});
		dialog.realize();
		
		if(eventBefore){
			eventBefore(dialog);
		}
		dialog.open();
	},
	
	deleteText: function(){
		var linesStyle = $("#selectStyle").val() == "Dark" ? "linesDark" : "linesLight";
		$("#table2").html("<div><span data-lines='"+linesStyle+"'>1</span></div>");
		$("#table1").html("");
	},
	
	eventBeforeChangeFile: function(dialog){
		var fileName = dialog.getModalBody().find('#fileName');
		var aceptarButton = dialog.getModalFooter().find('#aceptarButton');
		$(fileName).change(function(event){
			var dir = this.files[0];
			console.log(dir);
			$(aceptarButton).attr("data-name", dir.name);
		});
	},
	
	loadFile:function(dialog){
		var aceptarButton = dialog.getModalFooter().find('#aceptarButton');
		console.log($(aceptarButton).attr("data-name"));
	},
	
	saveText:function(ftext){
		console.log(ftext);
	},
	
	stylesPredefined: function(){
		var styles = [{
					id: "private",
					style: $("#selectStyle").val() == "Dark" ? "color:#7FFF00;" : "color:#0000ff;"
				},{
					id: "protected",
					style: $("#selectStyle").val() == "Dark" ? "color:#7FFF00;" : "color:#0000ff;"
				},{
					id: "public",
					style: $("#selectStyle").val() == "Dark" ? "color:#7FFF00;" : "color:#0000ff;"
				},{
					id: "class",
					style: $("#selectStyle").val() == "Dark" ? "color:#ff8103;" : "color:#0000ff;"
				},{
					id: "enum",
					style: $("#selectStyle").val() == "Dark" ? "color:#ff8103;" : "color:#0000ff;"
				},{
					id: "interface",
					style: $("#selectStyle").val() == "Dark" ? "color:#ff8103;" : "color:#0000ff;"
				},{
					id: "boolean",        
					style: $("#selectStyle").val() == "Dark" ? "color:#0099CC;" : "color:#ff4943;"
				},{
					id: "byte",
					style: $("#selectStyle").val() == "Dark" ? "color:#0099CC;" : "color:#ff4943;"
				},{
					id: "char",
					style: $("#selectStyle").val() == "Dark" ? "color:#0099CC;" : "color:#ff4943;"
				},{
					id: "double",
					style: $("#selectStyle").val() == "Dark" ? "color:#0099CC;" : "color:#ff4943;"
				},{
					id: "float",
					style: $("#selectStyle").val() == "Dark" ? "color:#0099CC;" : "color:#ff4943;"
				},{
					id: "int",
					style: $("#selectStyle").val() == "Dark" ? "color:#0099CC;" : "color:#ff4943;"
				},{
					id: "long",
					style: $("#selectStyle").val() == "Dark" ? "color:#0099CC;" : "color:#ff4943;"
				},{
					id: "short",
					style: $("#selectStyle").val() == "Dark" ? "color:#0099CC;" : "color:#ff4943;"
				},{
					id: "void",
					style: $("#selectStyle").val() == "Dark" ? "color:#0099CC;" : "color:#ff4943;"    
				},{
					id: "for",
					style: $("#selectStyle").val() == "Dark" ? "color:#ffff00;" : "color:#ff4943;"
				},{
					id: "if",
					style: $("#selectStyle").val() == "Dark" ? "color:#ffff00;" : "color:#ff4943;"
				},{
					id: "else",
					style: $("#selectStyle").val() == "Dark" ? "color:#ffff00;" : "color:#ff4943;"
				},{
					id: "do",
					style: $("#selectStyle").val() == "Dark" ? "color:#ffff00;" : "color:#ff4943;"
				},{
					id: "while",
					style: $("#selectStyle").val() == "Dark" ? "color:#ffff00;" : "color:#ff4943;"
				},{
					id: "switch",
					style: $("#selectStyle").val() == "Dark" ? "color:#ffff00;" : "color:#ff4943;"
				},{
					id: "import",
					style: $("#selectStyle").val() == "Dark" ? "color:#FFFF81;" : "color:#0000ff;"
				},{
					id: "package",
					style: $("#selectStyle").val() == "Dark" ? "color:#FFFF81;" : "color:#0000ff;"
				},{
					id: "this", 
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#0000ff;"
				},{
					id: "new",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#0000ff;"
				},{
					id: "native",       
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#ff4943;"
				},{
					id: "transient",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#ff4943;"
				},{
					id: "volatile",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#ff4943;"
				},{
					id: "static",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#ff4943;"
				},{
					id: "synchronized",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#ff4943;"
				},{
					id: "final",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#ff4943;"
				},{
					id: "abstract",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#ff4943;"
				},{
					id: "const",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#ff4943;"       
				},{
					id: "case",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#0000ff;"
				},{
					id: "default",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#0000ff;"
				},{
					id: "break",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#0000ff;"
				},{
					id: "continue",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#0000ff;"
				},{
					id: "goto",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#0000ff;"
				},{
					id: "instanceof",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#0000ff;"
				},{
					id: "strictfp",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#0000ff;"
				},{
					id: "assert",
					style: $("#selectStyle").val() == "Dark" ? "color:#00FFFF;" : "color:#0000ff;"
				},{
					id: "false",
					style: $("#selectStyle").val() == "Dark" ? "color:#F4A460;" : "color:#0000ff;"
				},{
					id: "true",
					style: $("#selectStyle").val() == "Dark" ? "color:#F4A460;" : "color:#0000ff;"
				},{
					id: "null",
					style: $("#selectStyle").val() == "Dark" ? "color:#F4A460;" : "color:#ff4943;"
				},{
					id: "try",
					style: $("#selectStyle").val() == "Dark" ? "color:#ffff00;" : "color:#0000ff;"
				},{
					id: "catch",
					style: $("#selectStyle").val() == "Dark" ? "color:#ffff00;" : "color:#0000ff;"
				},{
					id: "finally",
					style: $("#selectStyle").val() == "Dark" ? "color:#ffff00;" : "color:#0000ff;"
				},{
					id: "throw",
					style: $("#selectStyle").val() == "Dark" ? "color:#ffff00;" : "color:#0000ff;"
				},{
					id: "throws",
					style: $("#selectStyle").val() == "Dark" ? "color:#ffff00;" : "color:#0000ff;"
				},{
					id: "extends",
					style: $("#selectStyle").val() == "Dark" ? "color:#ff8103;" : "color:#0000ff;"
				},{
					id: "implements",
					style: $("#selectStyle").val() == "Dark" ? "color:#ff8103;" : "color:#0000ff;"
				},{
					id: "super",
					style: $("#selectStyle").val() == "Dark" ? "color:#ff8103;" : "color:#0000ff;"
				},{
					id: "return",
					style: $("#selectStyle").val() == "Dark" ? "color:#ff8103;" : "color:#0000ff;"
				}];
		return styles;
	},
/*//Clase de ejemplo	
 public class Deposito implements clase{    
    private float diametro;
    private float altura;
    private String idDeposito;
    public Deposito () { 
        this(0,0,"");            
    }
    public Deposito (float valor_diametro, float valor_altura, String valor_idDeposito) {
        if (valor_diametro > 0 && valor_altura > 0) {
            this.diametro = valor_diametro;
            this.altura = valor_altura;
            this.idDeposito = valor_idDeposito;
        } else {
            this.diametro = 10;
            this.altura = 5;
            idDeposito = "000";
        }   
	} 

    public void setValoresDeposito (String valor_idDeposito, float valor_diametro, float valor_altura) {
        idDeposito = valor_idDeposito;
        diametro = valor_diametro;
        altura = valor_altura;
        if (idDeposito !="" && valor_diametro > 0 && valor_altura > 0) {
        } else {
            System.out.println ("Valores no admisibles. No se han establecido valores para el depósito");
            idDeposito = "";
            diametro = 0;
            altura = 0;
        }     
	} 

    public float getDiametro () { return diametro; } 
    public float getAltura () { return altura; }
    public String getIdDeposito () { return idDeposito; }
    public float valorCapacidad () {
        float capacidad;
        float pi = 3.1416f; 
        capacidad = pi * (diametro/2) * (diametro/2) * altura;
        return capacidad;
    } 
} */
}