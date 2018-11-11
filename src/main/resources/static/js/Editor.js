
/*Se crea una clase en javascript*/	
var Editor = Editor ||{
	HeightWin: "",
	HeightHeader: "",
	HeightFooter: "",
	Interval: "",
	/*Inicialización de la clase*/
	init: function(){
		Editor.initEvents();
	},	
	
	initEvents: function(){	
		$(window).on('resize', function(){
			Editor.HeightWin = $(this).height(); 
			Editor.HeightHeader = $("#headerDiv").outerHeight();
			Editor.HeightFooter = $("#footerDiv").outerHeight();
			var heightOutPut = $("#outputDiv").outerHeight();
			var total = Editor.HeightWin - Editor.HeightHeader - Editor.HeightFooter - heightOutPut;
			var collaborateArea = Editor.HeightWin - Editor.HeightHeader - Editor.HeightFooter;
			$("#table1").outerHeight(total - 20);
			$("#table2").outerHeight(total - 20);
			$("#divOculto").outerHeight(total - 20);
			$("#collaborateArea").outerHeight(collaborateArea - 10);
			$("#shareArea").height(collaborateArea < 600 ? collaborateArea/2 + 50: collaborateArea/2);
			$(".contentChat").height((collaborateArea < 600 ? collaborateArea/2 + 50: collaborateArea/2) - 100);
		});	
		//Eventos fundamentales del editor
		$("#table1").keyup(function(e){
			var html = Editor.processText($(this).html());
			$("#table2").html(html);
			$("#table1").trigger("scroll");
		});		
		
		$('#table1').on('keydown .editable', function(e){
			if (e.keyCode === 9) { // tab key
				e.preventDefault();  // this will prevent us from tabbing out of the editor
				Editor.insertTab();
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
				$("#barToolsOutput").addClass("barToolsOutputThemeDark").removeClass("barToolsOutputThemeLight");
				$("#table1").css("caret-color", "whitesmoke");
				$('[data-lines]').attr("data-lines", "linesDark");
			}
			else{
				$("#table2,#outputDiv").addClass("themeLight").removeClass("themeDark");
				$("#barToolsOutput").addClass("barToolsOutputThemeLight").removeClass("barToolsOutputThemeDark");
				$("#table1").css("caret-color", "black");
				$('[data-lines]').attr("data-lines", "linesLight");
			}
			$("#table1").trigger("keyup");
		});
		
		//Evento para el cambio de font
		$("#selectFont").change(function(){
			$("#table2,#table1").css("font-family", $(this).val());
		});
		
		//Evento para el cambio de size font
		$("#selectSize").change(function(){
			$("#selectSizeValue").text($(this).val());
			$("#table2,#table1").css("font-size", $(this).val()+"px");
		});
		
		$("#selectStyle").trigger("change");
		$("#selectFont").trigger("change");
		$("#selectSize").trigger("change");
		$(window).trigger("resize");
		
		//Eventos de la barra de tools	
		$(".tools").click(function(e){
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
		
		$("#actionCleanOutput").click(function(){
			$("#textOutput").html("");
		});
		
		$("#actionShare").click(function(){
			if($("#collaborateArea").length == 0){
				clearInterval(Editor.Interval);
				$("#codigoGeneralDiv").removeClass("col-md-12 col-sm-12 col-xs-12").addClass("col-md-9 col-sm-8 col-xs-9");
				var height = Editor.HeightWin - Editor.HeightHeader - Editor.HeightFooter - 10;
				var heightChat = height < 600 ? height/2 + 50: height/2;
				var html = Editor.getHtmlChat(height, heightChat);
				$("#codigoGeneralRowDiv").append(html);
				$("#shareArea").slideToggle(2000);
				
				$("#collaborate").click(function(){
					if($("#collaborate i").hasClass("fa-user-slash")){
						$("#collaborate i").removeClass("fa-user-slash").addClass("fa-user");
						$("#shareArea").slideToggle(2000);
						Editor.Interval = setInterval(function(){ 
							$("#codigoGeneralDiv").removeClass("col-md-9 col-sm-8 col-xs-9").addClass("col-md-12 col-sm-12 col-xs-12");
							$("#collaborateArea").remove();
						}, 2000);
					}
					else{
						$("#collaborate i").removeClass("fa-user").addClass("fa-user-slash");
					}
				});
				
				$('#inputTextChat').keypress(function(event) {
					if(event.keyCode == 13) {
						//event.preventDefault();
						//var	d = $(this).val();					
						$('.contentChat').append($(this).val());
						$(this).val("");
					}
				});
			}
		});
	},
	
	processText:function(html){
		var styles = Editor.stylesPredefined();		
		//Add numbers lines
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
		var editor = document.getElementById("table1");
		var doc = editor.ownerDocument.defaultView;
		var sel = doc.getSelection();
		var range = sel.getRangeAt(0);

		var tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
		range.insertNode(tabNode);

		range.setStartAfter(tabNode);
		range.setEndAfter(tabNode); 
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
	
	getHtmlChat: function(height, heightChat){
		var heightContent = heightChat - 100;
		var html = "<div class='col-md-3 col-sm-4 col-xs-12' id='collaborateArea' style='height:" + height + "px;padding-left: 5px;'>"
						+"<div id='shareArea' style='display:none;height:" + heightChat + "px;'>"
							+"<div class='headerChat'>"
								+"<div class='iconsChat' id='collaborate'><i class='fa fa-user'></i></div>"
								+"<div class='iconsChat' id='microphone'><i class='fa fa-microphone'></i></div>"
								+"<div class='iconsChat' id='video'><i class='fa fa-video'></i></div>"
							+"</div>"
							+"<div class='contentChat' style='height:"+heightContent+"px;'>"
							+"</div>"
							+"<div class='footerChat'>"
								+"<input class='form-control' id='inputTextChat'/>"
							+"</div>"
						+ "</div>"
					+"</div>"
					
		return html;
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
}