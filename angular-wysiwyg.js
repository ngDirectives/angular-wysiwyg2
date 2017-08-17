//'use strict';

/*
Usage: <wysiwyg textarea-id="question" textarea-class="form-control"  textarea-height="80px" textarea-name="textareaQuestion" textarea-required ng-model="question.question" enable-bootstrap-title="true"></wysiwyg>
	options
		textarea-id 			The id to assign to the editable div
		textarea-class			The class(es) to assign to the the editable div
		textarea-height			If not specified in a text-area class then the hight of the editable div (default: 80px)
		textarea-name			The name attribute of the editable div 
		textarea-required		HTML/AngularJS required validation
		ng-model				The angular data model
		enable-bootstrap-title	True/False whether or not to show the button hover title styled with bootstrap	

Requires: 
	Twitter-bootstrap, fontawesome, jquery, angularjs, bootstrap-color-picker (https://github.com/buberdds/angular-bootstrap-colorpicker)

*/

angular.module('wysiwyg.module',[]) 
  .directive('wysiwyg', function ($timeout,$rootScope) {
      return {
          template: '<div class="editorTiny">' +
					  '<style>' +
					  '	.wysiwyg-btn-group-margin{  margin-right:5px; }' +
					  '	.wysiwyg-select{ height:30px;margin-bottom:1px;}' +
					  '	.wysiwyg-colorpicker{ font-family: arial, sans-serif !important;font-size:17px !important; padding:2px 10px !important;}' +
					  '</style>' +
					  '<div class="btn-group btn-group-sm wysiwyg-btn-group-margin">' +
						  '<button title="Bold" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'bold\')" ng-class="{ active: isBold}"><i class="fa fa-bold"></i></button>' +
						  '<button title="Italic" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'italic\')" ng-class="{ active: isItalic}"><i class="fa fa-italic"></i></button>' +
						  '<button title="Underline" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'underline\')" ng-class="{ active: isUnderlined}"><i class="fa fa-underline"></i></button>' +
						  '<button title="Strikethrough" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'strikethrough\')" ng-class="{ active: isStrikethrough}"><i class="fa fa-strikethrough"></i></button>' +
						  '<button title="Subscript" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'subscript\')" ng-class="{ active: isSubscript}"><i class="fa fa-subscript"></i></button>' +
						  '<button title="Superscript" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'superscript\')" ng-class="{ active: isSuperscript}"><i class="fa fa-superscript"></i></button>' +
					  '</div>' +
					  '<div class="btn-group btn-group-sm wysiwyg-btn-group-margin">' +
						  '<select tabindex="-1"  unselectable="on" class="form-control wysiwyg-select" ng-model="font" ng-options="f for f in fonts" ng-change="setFont()">' +
						  '</select>' +
					  '</div>' +
					  '<div class="btn-group btn-group-sm wysiwyg-btn-group-margin">' +
						  '<select unselectable="on" tabindex="-1" class="form-control wysiwyg-select" ng-model="fontSize" ng-options="f.size for f in fontSizes" ng-change="setFontSize()">' +
						  '</select>' +
					  '</div>' +
					  //'<div class="btn-group btn-group-sm wysiwyg-btn-group-margin">' +
					  //	'<button title="Font Color" tabindex="-1" colorpicker="rgba" type="button" colorpicker-position="top" class="btn btn-default ng-valid ng-dirty wysiwyg-colorpicker wysiwyg-fontcolor" ng-model="fontColor" ng-change="setFontColor()">A</button>'+	
					  //	'<button title="Hilite Color" tabindex="-1" colorpicker="rgba" type="button" colorpicker-position="top" class="btn btn-default ng-valid ng-dirty wysiwyg-colorpicker wysiwyg-hiliteColor" ng-model="hiliteColor" ng-change="setHiliteColor()">H</button>'+	
					  //'</div>' +
					  '<div class="btn-group btn-group-sm wysiwyg-btn-group-margin">' +
						  '<button title="Remove Formatting" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'removeFormat\')" ><i class="fa fa-eraser"></i></button>' +
					  '</div>' +
					  '<div class="btn-group btn-group-sm wysiwyg-btn-group-margin">' +
						  '<button title="Ordered List" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'insertorderedlist\')" ng-class="{ active: isOrderedList}"><i class="fa fa-list-ol"></i></button>' +
						  '<button title="Unordered List" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'insertunorderedlist\')" ng-class="{ active: isUnorderedList}"><i class="fa fa-list-ul"></i></button>' +
						  //'<button title="Outdent" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'outdent\')"><i class="fa fa-outdent"></i></button>' +
						  //'<button title="Indent" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'indent\')"><i class="fa fa-indent"></i></button>' +
					  '</div>' +
					  '<div class="btn-group btn-group-sm wysiwyg-btn-group-margin">' +
						  '<button title="Left Justify" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'justifyleft\')" ng-class="{ active: isLeftJustified}"><i class="fa fa-align-left"></i></button>' +
						  '<button title="Center Justify" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'justifycenter\')" ng-class="{ active: isCenterJustified}"><i class="fa fa-align-center"></i></button>' +
						  '<button title="Right Justify" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'justifyright\')" ng-class="{ active: isRightJustified}"><i class="fa fa-align-right"></i></button>' +
					  '</div>' +
					  '<div class="btn-group btn-group-sm wysiwyg-btn-group-margin">' +
						  '<button title="Code" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'formatblock\', \'pre\')"  ng-class="{ active: isPre}"><i class="fa fa-code"></i></button>' +
						  '<button title="Quote" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'formatblock\', \'blockquote\')"  ng-class="{ active: isBlockquote}"><i class="fa fa-quote-right"></i></button>' +
						  '<button title="Paragragh" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'insertParagraph\')"  ng-class="{ active: isParagraph}">P</button>' +
					  '</div>' +
					  '<div class="btn-group btn-group-sm wysiwyg-btn-group-margin">' +
						  '<button ng-show="!isLink" tabindex="-1" title="Link" type="button" unselectable="on" class="btn btn-default" ng-click="createLink()"><i class="fa fa-link" ></i> </button>' +
						  '<button ng-show="isLink" tabindex="-1" title="Unlink" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'unlink\')"><i class="fa fa-unlink"></i> </button>' +
						  '<button title="Image" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="insertImage()"><i class="fa fa-picture-o"></i> </button>' +
					  '</div>' +
					  '<div class="btn-group btn-group-sm wysiwyg-btn-group-margin">' +
						  '<button title="Print Preview" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="printPreview()"><i class="fa fa-search"></i> </button>' +
						  '<button title="Print" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="printPDF(true)"><i class="fa fa-print"></i> </button>' +
					  '</div>' +
                       '<div class="btn-group btn-group-sm wysiwyg-btn-group-margin">' +
						  '<button title="PDF" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="printPDF(false)"><i class="fa fa-file-text-o"></i> </button>' +
						  '<button title="Voice" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="texttospeach($event)"  ng-class=\'{ "mic-active": $root.recognizing }\'><i class="fa" ng-class=\'$root.recognizing ? "fa-microphone-slash" : "fa-microphone"\'></i> </button>' +
					  '</div>' +
					  '<div id="{{textareaId}}" style="resize:vertical;height:{{textareaHeight || \'80px\'}}; font-family:{{\'Times New Roman\'}}; font-size:{{\'17px\'}}; overflow:auto" contentEditable="true" class="{{textareaClass}} wysiwyg-textarea" rows="{{textareaRows}}" name="{{textareaName}}" required="{{textareaRequired}}" placeholder="{{textareaPlaceholder}}" ng-model="value"></div>' +
					  ' <span class="final" id="final_span"></span> <span class="interim" id="interim_span"></span>' +
				  '</div>',
          restrict: 'E',
          scope: {
              value: '=ngModel',
              textareaHeight: '@textareaHeight',
              textareaName: '@textareaName',
              textareaPlaceholder: '@textareaPlaceholder',
              textareaClass: '@textareaClass',
              textareaRequired: '@textareaRequired',
              textareaId: '@textareaId',
          },
          replace: true,
          require: 'ngModel',
          link: function (scope, element, attrs, ngModelController) {

              var textarea = element.find('div.wysiwyg-textarea');

              scope.fonts = [
				  'Georgia',
				  'Palatino Linotype',
				  'Times New Roman',
				  'Arial',
				  'Helvetica',
				  'Arial Black',
				  'Comic Sans MS',
				  'Impact',
				  'Lucida Sans Unicode',
				  'Tahoma',
				  'Trebuchet MS',
				  'Verdana',
				  'Courier New',
				  'Lucida Console',
				  'Helvetica Neue'
              ].sort();
              
              var final_transcript = '', ignore_onend, start_timestamp, recognition = new webkitSpeechRecognition(), tempmodel,els;
			  recognition.continuous = true;
			  recognition.interimResults = true;
			  $rootScope.recognizing = false
			  var two_line = /\n\n/g;
				var one_line = /\n/g;
				function linebreak(s) {
				  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
				}
				var first_char = /\S/;
				function safeApply(fn) {
		          var phase;
		          phase = scope.$root.$$phase;
		          if (phase === "$apply" || phase === "$digest") {
		            if (fn && (typeof fn === "function")) {
		              return fn();
		            }
		          } else {
		            return scope.$apply(fn);
		          }
		        };
			  function capitalize(s) {
				  return s.replace(first_char, function(m) { return m.toUpperCase(); });
				}
			  recognition.onstart = function() {
			  	$("#final_span").html("");
			  	final_transcript=interim_transcript="";
			  	if (!scope.value) {
			  		tempmodel="";
			  	}else{
			  		tempmodel=scope.value;
			  	}
			    $rootScope.recognizing = true;

			  };
			  recognition.onerror = function(event) {

			    if (event.error == 'no-speech') {
			      ignore_onend = true;
			      $("#final_span").html("<h2>No Speech</h2>");
			    }
			    if (event.error == 'audio-capture') {
			      ignore_onend = true;
			      $("#final_span").html("<h2>No Audio</h2>");
			    }
			    if (event.error == 'not-allowed') {
			      if (event.timeStamp - start_timestamp < 100) {
			        $("#final_span").html("<h2>Allow permission of audio capture to use this functionality.</h2>");
			      } else {
			        $("#final_span").html("<h2>Allow permission of audio capture to use this functionality.</h2>");
			      }
			      ignore_onend = true;
			    }
			  };
			  recognition.onend = function() {
			    $rootScope.recognizing = false;
			    if (ignore_onend) {
			      return;
			    }
			    if (!final_transcript) {
			      showInfo('info_start');
			      return;
			    }
			   
			  };
			  recognition.onresult = function(event) {
			    var interim_transcript = '';
			    var isfinal;
			    for (var i = event.resultIndex; i < event.results.length; ++i) {
			      if (event.results[i].isFinal) {
			      	isfinal=true;
			        final_transcript += event.results[i][0].transcript;
			      } else {
			      	isfinal=false;
			        interim_transcript += event.results[i][0].transcript;
			      }
			    }
  				els.scrollTop(els[0].scrollHeight);
			    safeApply(function() {
		            return scope.value = tempmodel + linebreak(final_transcript) + linebreak(interim_transcript);
		          });
			    
			  //  console.log(linebreak(final_transcript))
			  //  console.log(linebreak(interim_transcript))
			   // $("#final_span").html(linebreak(final_transcript));
			 //  $("#interim_span").html(linebreak(interim_transcript));
			  };
			
              scope.texttospeach = function (el) {
              	els = $(el.currentTarget).parent().next();
              	if ($rootScope.recognizing) {
              		$rootScope.recognizing=!$rootScope.recognizing;
				    recognition.stop();
				    return;
				}	
				recognition.start();
              }
             
              scope.font = scope.fonts[12];

              scope.fontSizes = [
				  {
				      value: '1',
				      size: '10px'
				  },
				  {
				      value: '2',
				      size: '13px'
				  },
				  {
				      value: '3',
				      size: '16px'
				  },
				  {
				      value: '4',
				      size: '17px'
				  },
				  {
				      value: '5',
				      size: '18px'
				  },
				  {
				      value: '6',
				      size: '24px'
				  },
				  {
				      value: '7',
				      size: '32px'
				  },
				  {
				      value: '8',
				      size: '48px'
				  }
              ];
              scope.fontSize = scope.fontSizes[3];
              // scope.cmdValue('fontsize',4);

              if (attrs.enableBootstrapTitle === "false" && attrs.enableBootstrapTitle !== undefined)
                  element.find('button[title]').tooltip({ container: 'body' });
              textarea.on('keyup mouseup', function () {
                  scope.$apply(function readViewText() {
                      var html = textarea.html();

                      if (html == '<br>') {
                          html = '';
                      }

                      ngModelController.$setViewValue(html);
                  });
              });
              scope.isLink = false;


              //Used to detect things like A tags and others that dont work with cmdValue().
              function itemIs(tag) {
                  var selection = window.getSelection().getRangeAt(0);
                  if (selection) {
                      if (selection.startContainer.parentNode.tagName === tag.toUpperCase() || selection.endContainer.parentNode.tagName === tag.toUpperCase()) {
                          return true;
                      } else { return false; }
                  } else { return false; }
              }

              //Used to detect things like A tags and others that dont work with cmdValue().
              function getHiliteColor() {
                  var selection = window.getSelection().getRangeAt(0);
                  if (selection) {
                      var style = $(selection.startContainer.parentNode).attr('style');

                      if (!angular.isDefined(style))
                          return false;

                      var a = style.split(';');
                      for (var i = 0; i < a.length; i++) {
                          var s = a[i].split(':');
                          if (s[0] === 'background-color')
                              return s[1];
                      }
                      return '#fff';
                  } else {
                      return '#fff';
                  }
              }
              textarea.on('click keyup focus mouseup', function () {
                  $timeout(function () {
                      scope.isBold = scope.cmdState('bold');
                      scope.isUnderlined = scope.cmdState('underline');
                      scope.isStrikethrough = scope.cmdState('strikethrough');
                      scope.isItalic = scope.cmdState('italic');
                      scope.isSuperscript = itemIs('SUP');//scope.cmdState('superscript');
                      scope.isSubscript = itemIs('SUB');//scope.cmdState('subscript');	
                      scope.isRightJustified = scope.cmdState('justifyright');
                      scope.isLeftJustified = scope.cmdState('justifyleft');
                      scope.isCenterJustified = scope.cmdState('justifycenter');
                      scope.isPre = scope.cmdValue('formatblock') == "pre";
                      scope.isBlockquote = scope.cmdValue('formatblock') == "blockquote";

                      scope.isOrderedList = scope.cmdState('insertorderedlist');
                      scope.isUnorderedList = scope.cmdState('insertunorderedlist');

                      scope.fonts.forEach(function (v, k) { //works but kinda crappy.
                          if (scope.cmdValue('fontname').indexOf(v) > -1) {
                              scope.font = v;
                              return false;
                          }
                      });

                      scope.fontSizes.forEach(function (v, k) {
                          if (scope.cmdValue('fontsize') === v.value) {
                              //						  	debugger;
                              scope.fontSize = v;
                              return false;
                          }
                      });
                      scope.hiliteColor = getHiliteColor();
                      element.find('button.wysiwyg-hiliteColor').css("background-color", scope.hiliteColor);

                      scope.fontColor = scope.cmdValue('forecolor');
                      element.find('button.wysiwyg-fontcolor').css("color", scope.fontColor);

                      scope.isLink = itemIs('A');
                  }, 10);
              });

              // model -> view
              ngModelController.$render = function () {
                  textarea.html(ngModelController.$viewValue);
              };

              scope.format = function (cmd, arg) {
                  document.execCommand(cmd, false, arg);
              };
              scope.cmdState = function (cmd, id) {
                  return document.queryCommandState(cmd);
              };
              scope.cmdValue = function (cmd) {
                  return document.queryCommandValue(cmd);
              };
              scope.createLink = function () {
                  var input = prompt('Enter the link URL');
                  if (input && input !== undefined)
                      scope.format('createlink', input);
              };
              scope.insertImage = function () {
                  var input = prompt('Enter the image URL');
                  if (input && input !== undefined)
                      scope.format('insertimage', input);
              };
              scope.setFont = function () {
                  scope.format('fontname', scope.font);
              };
              scope.setFontSize = function () {
                  scope.format('fontsize', scope.fontSize.value);
              };
              scope.setFontColor = function () {
                  scope.format('forecolor', scope.fontColor);
              };
              scope.setHiliteColor = function () {
                  scope.format('hiliteColor', scope.hiliteColor);
              };
              scope.format('enableobjectresizing', true);
              scope.format('styleWithCSS', true);

              function popupwindow(url, title, w, h) {
                  var left = (screen.width / 2) - (w / 2);
                  var top = (screen.height / 2) - (h / 2);
                  return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
              }

              scope.saveandprint = function () {
                  // Add Save here...
                  scope.print();
              }
              scope.printPreview = function () {
                  var toPrint = document.getElementById('question');
                  var popupWin = popupwindow("_blank", "Print Preview", "710", "850");
                  popupWin.document.open();
                  popupWin.document.write('<html><title>Print Preview</title><link href="Content/css/PrintForTemplates.css" rel="stylesheet" media="screen"/></head><body">');
                  popupWin.document.write(toPrint.innerHTML);
                  popupWin.document.write('</html>');
                  popupWin.document.close();
              };

              scope.print = function () {
                  var toPrint = document.getElementById('question');
                  var popupWin = popupwindow("_blank", "Print", "1024", "768");
                  popupWin.document.open();
                  popupWin.document.write('<html><title>Print</title><link href="Content/css/PrintForTemplates.css" rel="stylesheet" /><link href="print.css" rel="stylesheet" /></head><body onload="window.print()">');
                  popupWin.document.write(toPrint.innerHTML);
                  popupWin.document.write('</html>');
                  popupWin.document.close();
              };

              scope.printPDF = function (IsPrint) {
                  if ($('#logo-set').length > 0) {
                      $(this).css('marginRight', '50%');
                  }
                  if ($('#question table').length > 0) {
                      $('#question table>thead').append('<tr>' + $('#question table>tbody>tr').first().html() + '</tr>');
                  }
                  if ($('#l-center').length > 0) {
                      $('#l-center').css('float', 'right');
                  }
                  var pdf = new jsPDF('p', 'pt', 'letter');
                  var source = $('#question')[0];
                  var i = 0;
                  var ar = [];
                  $('#question img').each(function (e) {
                      if (i == 0) {
                          ar.push($(this).parent().next().css('marginTop'));
                          $(this).parent().next().css('marginTop', $(this).height() + 75);
                      } else {
                          ar.push($(this).parent().next().css('marginTop'));
                          $(this).parent().next().css('marginTop', $(this).height() + 45);
                      }
                      i++;
                  })
                  var pdf = new jsPDF('p', 'pt', 'letter');

                  // source can be HTML-formatted string, or a reference
                  // to an actual DOM element from which the text will be scraped.
                  var source = $('#question')[0];

                  // we support special element handlers. Register them with jQuery-style
                  // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
                  // There is no support for any other type of selectors
                  // (class, of compound) at this time.
                  var specialElementHandlers = {
                      // element with id of "bypass" - jQuery style selector
                      '#bypassme': function (element, renderer) {
                          // true = "handled elsewhere, bypass text extraction"
                          return true
                      }
                  };

                  var margins = {
                      top: 35,
                      bottom: 30,
                      left: 40,
                      width: 522
                  };
                  // all coords and widths are in jsPDF instance's declared units
                  // 'inches' in this case
                  pdf.fromHTML(
                               source // HTML string or DOM elem ref.
                               , margins.left // x coord
                               , margins.top // y coord
                               , {
                                   'width': margins.width // max width of content on PDF
                                 , 'elementHandlers': specialElementHandlers
                               },
                               function (dispose) {
                                   // dispose: object with X, Y of the last line add to the PDF
                                   //          this allow the insertion of new lines after html
                                   // pdf.save('Test.pdf');
                                   if (IsPrint) {
                                       pdf.autoPrint();  // <<--------------------- !!
                                   }
                                   //pdf.output('dataurlnewwindow');

                                   var blob = pdf.output("blob");
                                   window.open(URL.createObjectURL(blob));

                                   setTimeout(function () {
                                       if ($('#logo-set').length > 0) {
                                           $(this).css('marginRight', '30%');
                                       }
                                       if ($('#question table').length > 0) {
                                           $('#question table>thead').empty();
                                       }

                                       if ($('#l-center').length > 0) {
                                           $('#l-center').css('float', '');
                                       }
                                       i = 0;
                                       $('#question img').each(function (e) {
                                           $(this).parent().next().css('marginTop', ar[i]);
                                           i++;
                                           $('#question header div').css('marginTop', '');
                                       });
                                       ar = [];

                                   }, 400);
                               }, margins);


                  /////////////////
                  //debugger;
                  //var toPrint = document.getElementById('question');
                  //var elHtml = toPrint.innerHTML;
                  //var link = document.createElement('a');
                  //var mimeType = 'text/html';
                  //$http({
                  //    method: 'GET',
                  //    url: httpServiceUrlForService + "api/CommunicationForm/getPdfConvertDoc?InnerHTML=" + elHtml,
                  //    //transformRequest: function (data) {
                  //    //    var formData = new FormData();
                  //    //    if (IsBlank(data.model)) {
                  //    //        alert("Empty file");
                  //    //        return;
                  //    //    }
                  //    //    formData.append("model", angular.toJson(data.model));
                  //    //    return formData;
                  //    //},
                  //    //data: { model: $scope.model }
                  //}).success(function (data, status, headers, config) {
                  //    alert(JSON.stringify(data));
                  //});

                  ////window.open("http://localhost:63036/App_Data/HTMLFiles/temp.html");


                  ////link.setAttribute('download', "test.html");
                  ////link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));

                  ////link.click(); 
              };

          }
      };
  });