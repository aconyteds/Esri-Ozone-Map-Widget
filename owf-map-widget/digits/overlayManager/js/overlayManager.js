/**
 * @copyright © 2013 Environmental Systems Research Institute, Inc. (Esri)
 *
 * @license
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at<br>
 * <br>
 *     {@link http://www.apache.org/licenses/LICENSE-2.0}<br>
 * <br>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
define(["cmwapi-adapter/cmwapi-adapter",],
       function(cmwapiAdapter) {
        var adapter;
    var OverlayManager =  function(map, errorNotifier) {
        this.adapter = adapter = new cmwapiAdapter(map, errorNotifier);
        $('#popover_overlay_wrapper').load('./digits/overlayManager/index.html', function() {
            $(window).bind("resize",function() {
                changeAddScrollState();
            });
            $('#overlay-tree').tree({
                data: adapter.overlayManager.getOverlayTree(),
                dragAndDrop:true,
                autoOpen: true,
                onCreateLi: function(node, $li) {
                    node['node-type'] = node.type;
                    var basePath = './digits/overlayManager/images/icons/';
                    var image = node.type === 'feature' ? basePath + 'kml_icon.gif': basePath + 'Tree_Folder.png';
                    var inputString = '<input type="checkbox" id="' + node.id+ '" class ="tree-node" node-type="' + node.type;
                    var checked = node.isHidden === false ? (inputString + '" checked="checked"/>') : (inputString + '"/>');
                    $li.find('.jqtree-title').before(
                        checked + '<img src=' + image + ' alt="Overlay Icon" height="25" width="25">'
                    );
                },
                onCanMoveTo: function(moved_node, target_node, position) {
                    if(target_node['node-type'] === 'feature') {
                        return (position !== 'inside');
                    } else {
                        return true;
                    }
                }
            });
            $('#overlay-tree').bind('tree.dblclick',
            function(event) {
                var span = $('#' + event.node.id + '[node-type= "' + event.node['node-type'] + '"]').siblings('span');
                var text = event.node.name;
                var html = '<input value ="' + text + '" type="text">';
                $(span).parent().addClass('form-group');
                $(span).html(html);
                $(span).find('input').focus();

                $(span).find('input').keypress(function(e) {
                    var keycode = (e.keyCode ? e.keyCode : e.which);
                    if(keycode === 13) {
                        doneInput();
                    }
                });

                $(span).find('input').focusout(function() {
                    doneInput();
                });

                var doneInput = function() {
                    var inputValue = $(span).find('input').val();
                    $(span).find('input').remove();
                    if(event.node['node-type'] === 'overlay' && inputValue !== '') {
                        $(span).text(inputValue);
                        adapter.overlayManager.sendOverlayCreate(event.node.id, inputValue);
                    } else if (event.node['node-type'] === 'feature' && inputValue !== '') {
                        $(span).text(inputValue);
                        adapter.overlayManager.sendFeatureUpdate(event.node.parent.id, event.node.id, inputValue, null);
                    } else {
                        $(span).text(text);
                    }
                };
            });
            $('#overlay-tree').bind('tree.move', function(event) {
                var moveInfo = event.move_info;
                if(moveInfo.moved_node['node-type'] === 'feature') {
                    adapter.overlayManager.sendFeatureUpdate(moveInfo.moved_node.parent.id, moveInfo.moved_node.id,
                        moveInfo.moved_node.name, moveInfo.target_node.id);
                } else {
                    adapter.overlayManager.sendOverlayUpdate(moveInfo.moved_node.id, moveInfo.moved_node.name, moveInfo.target_node.id);
                }
            });
            $('#overlay-tree').bind('tree.open', function() {
                resizeOverlayToTree('#overlay-tree', 90);
            });

            adapter.overlayManager.bindTreeChangeHandler(updateTreeData);
            $('#overlay-add-icon').on('click', setStateAdd);
            $('#add-overlay-icon').on('click', setStateAddOverlay);
            $('#overlay-delete-icon').on('click', setStateRemove);
            $('#overlay-back-icon').on('click', setStateInit);
            $('#overlay-manager-add-button').on('click',  addOverlayOrFeature);
            $('#overlay-manager-delete-button').on('click',  deleteOverlayOrFeature);
            $('#overlay-selection').on('change', overlaySelectonChanged);
            $('#type-selection').on('change', getTypeSelection);
            $('form').find('.form-control.default').keyup(removeSucessFromURL);
            $('#feature-add-url').keyup(validateURLInput);
        });
    };

    OverlayManager.prototype.toggleOverlayManager = function() {
        $('#popover_overlay_wrapper').toggle();
        $('#basemaps').removeClass('selected');
        $('#popover_content_wrapper').hide();
        $('#overlay').toggleClass('selected');
       setStateInit();
    };

    var changeAddScrollState = function() {
        if($('#add-overlay-div').is(':visible') || $('#add-feature-div').is(':visible')) {
             var scrollHeight = parseInt($("#overlay-manager-add")[0].scrollHeight);
            if(($(window).height() - scrollHeight) <= 200) {
                $("#overlay-manager-add").css("height", $(window).height() - 200);
            } else {
                var featureHeight = $('#add-feature-div').is(':visible') ? ($('#add-feature-div').height()) : -15;
                var overlayHeight = $('#add-overlay-div').is(':visible') ? $('#add-overlay-div').height() : -15;
                var height = (featureHeight + overlayHeight + 32);
                $("#overlay-manager-add").css("height", height);
            }
            resizeOverlayManager();
        }
    };

   var overlaySelectonChanged = function() {
        if($('#overlay-selection').val() === 'Add New Overlay') {
            $('#add-overlay-div').show();
        } else {
            $('#add-overlay-div').hide();
        }
        changeAddScrollState();
        checkAddFormCompleted();
    };

    var addOverlayOrFeature = function() {
        var featureName = $('#feature-add-name').val();
        var featureId = $('#feature-add-id').val();
        var featureUrl = $('#feature-add-url').val();
        var featureParams = $('#feature-add-params').val();
        var overlayName = $('#overlay-add-name').val();
        var overlayId = $('#overlay-add-id').val();
        var zoom = $('#zoom-checkbox').is(':checked');
        var featureType = $('#type-selection').val().toLowerCase();
        if(!($('#add-feature-div').is(':visible'))) {
            adapter.overlayManager.sendOverlayCreate(overlayId, overlayName);
        } else if($('#overlay-selection').val() === 'Add New Overlay') {
            adapter.overlayManager.sendOverlayCreate(overlayId, overlayName);
            adapter.overlayManager.sendFeaturePlotUrl(overlayId, featureId, featureName,
                featureType, featureUrl, featureParams, zoom);
        } else {
            adapter.overlayManager.sendFeaturePlotUrl($('#overlay-selection').find(":selected").attr('id'),
                featureId, featureName, featureType, featureUrl, featureParams, zoom);
        }
        setStateInit();
    };

    var deleteOverlayOrFeature = function() {
        $("#overlay-tree input:checkbox:checked").each(function() {
            if($(this).attr('node-type') === 'overlay') {
                adapter.overlayManager.sendOverlayRemove($(this).attr('id'));
            }
            if($(this).attr('node-type') === 'feature') {
                var node = $('#overlay-tree').tree('getNodeById', $(this).attr('id'));
                adapter.overlayManager.sendFeatureUnplot(node.parent.id,$(this).attr('id'));
            }
        });
    };

    var getTypeSelection = function() {

        if($('#type-selection').val().toLowerCase() === 'kml') {
            $('#feature-params-group').hide();
        } else {
            $('#feature-params-group').show();
        }
        changeAddScrollState();
        checkAddFormCompleted();
    };

    var resizeOverlayManager = function() {
        var height = $('#overlay-manager-add').height() + 100;
        $('#popover_overlay_wrapper').css('height', height + 'px');
    };

    var updateOverlaySelection = function() {
        $('#overlay-selection > option').remove();
        var overlayObject = adapter.overlayManager.getOverlays();
        for(var key in overlayObject) {
            var appendHtml = ' <option id= "'+ overlayObject[key].id +'">' + overlayObject[key].name + '</option>';
            $('#overlay-selection').append(appendHtml);
        }
        var defaultHtmlAdd = '<option id= "add-new-overlay-option">Add New Overlay</option>';
        $('#overlay-selection').append(defaultHtmlAdd);
        overlaySelectonChanged();
    };

    var isOverlayTreeEmpty = function() {
        return adapter.overlayManager.getOverlayTree().length === 0;
    };

   var removeSucessFromURL = function() {
        if($(this).attr('id') !== 'feature-add-url') {
            $('#feature-add-url').parent().removeClass('has-success');
        }
        checkAddFormCompleted();
    };

   var validateURLInput = function() {
        if(!isValidUrl($(this).val())) {
            $(this).parent().removeClass('has-success');
            $(this).parent().addClass('has-error');
            $('.help-block').show();
        } else {
            $(this).parent().removeClass('has-error');
            $(this).parent().addClass('has-success');
            $(this).removeClass('has-error');
            $('.help-block').hide();
        }
        changeAddScrollState();
    };

    var isValidUrl = function(url){
          return (/\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~ |‌​]/).test(url);
    };

    var checkAddFormCompleted = function() {
        var emptyInputs = $('.form-control.default').filter(function() {
            return $(this).val() === '' && $(this).is(':visible');
        }).length;
        if(emptyInputs === 0 || !($('#add-feature-div').is(':visible'))) {
            $('#overlay-manager-add-button').removeClass('disabled');
        } else {
            $('#overlay-manager-add-button').addClass('disabled');
        }
    };

    var clearAddInputs = function() {
        $('#feature-add-name').val('');
        $('#feature-add-id').val('');
        $('#feature-add-url').val('');
        $('#feature-add-params').val('');
        $('#overlay-add-name').val('');
        $('#overlay-add-id').val('');
    };

    var bindSelectionHandlers = function() {
        $("#overlay-tree.default input:checkbox").off('change');
        $("#overlay-tree.default input:checkbox").on('change', function () {
            var node = $('#overlay-tree').tree('getNodeById', $(this).attr('id'));
            if($(this).is(':checked') && $(this).attr('node-type') === 'overlay') {
               adapter.overlayManager.sendOverlayShow($(this).attr('id'));
            } else if(!($(this).is(':checked')) && $(this).attr('node-type') === 'overlay') {
                adapter.overlayManager.sendOverlayHide($(this).attr('id'));
            } else if($(this).is(':checked') && $(this).attr('node-type') === 'feature') {
               adapter.overlayManager.sendFeatureShow(node.parent.id, $(this).attr('id'));
            } else if(!$(this).is(':checked') && $(this).attr('node-type') === 'feature') {
                adapter.overlayManager.sendFeatureHide(node.parent.id, $(this).attr('id'));
            }
        });
        $("#overlay-tree.remove-tree input:checkbox").on('change', function () {
            checkDeleteButtonDisabled();
            $(this).parent().next('ul').find('input:checkbox').prop('checked', $(this).prop("checked"));
        });
    };


    var resizeOverlayToTree = function(tree, offset) {
        var treeHeight = $(tree).css('height');
        treeHeight = parseInt(treeHeight.substr(0, treeHeight.length-2));
        $('#popover_overlay_wrapper').css('height', (treeHeight + offset) + 'px');
    };

    var updateTree = function() {
        $('#overlay-tree').tree('loadData',adapter.overlayManager.getOverlayTree());
        resizeOverlayToTree('#overlay-tree', 90);
        if(!isOverlayTreeEmpty()) {
            $('#no-overlay-tooltip').hide();
        } else {
            $('#no-overlay-tooltip').show();
        }
        bindSelectionHandlers();
    };
    var updateTreeData = function() {
        updateTree();
        setStateInit();
    };


    var checkDeleteButtonDisabled = function() {
        $('#overlay-manager-delete-button').addClass('disabled');
        if($('#overlay-tree.remove').is(':visible') && $("#overlay-tree input:checkbox:checked").length > 0) {
            $('#overlay-manager-delete-button').removeClass('disabled');
        }
    };

    var setStateInit = function() {
        $('#overlay-tree').removeClass('remove-tree');
        $('#overlay-tree').addClass('default');
        $('#overlay-delete-icon').removeClass('disabled');
        $('#no-overlay-tooltip').hide();
        if(isOverlayTreeEmpty()) {
            $('#no-overlay-tooltip').show();
            $('#overlay-delete-icon').addClass('disabled');
        }
        $('.add').hide();
        $('.remove').hide();
        $('.init').show();
        $('#overlay-tree').css('top','50px');
        $('#feature-add-url').parent().removeClass('has-success');
        $('#feature-add-url').parent().removeClass('has-error');
        updateTree();
        resizeOverlayToTree('#overlay-tree', 90);
    };

    var addState = function() {
        $('#no-overlay-tooltip').hide();
        clearAddInputs();
        $('.init').hide();
        $('.add').show();
    };

    var setStateAdd = function() {
        $('#add-overlay-div').hide();
        $('#add-feature-div').show();
        addState();
        checkAddFormCompleted();
        updateOverlaySelection();
        changeAddScrollState();
    };

    var setStateAddOverlay = function() {
        $('#add-overlay-div').show();
        $('#add-feature-div').hide();
        addState();
        changeAddScrollState();
    };

   var setStateRemove = function() {
        $("#overlay-tree.default input:checkbox").off('change');
        $('.init').hide();
        $('.remove').show();
        $('#overlay-tree').addClass('remove-tree');
        $('#overlay-tree').removeClass('default');
        bindSelectionHandlers();
        updateOverlaySelection();
        checkDeleteButtonDisabled();
        $("#overlay-tree.remove-tree input:checkbox").removeAttr('checked');
        $('#overlay-tree').css('top','85px');
        resizeOverlayToTree('#overlay-tree', 125);
    };


    return OverlayManager;
});
