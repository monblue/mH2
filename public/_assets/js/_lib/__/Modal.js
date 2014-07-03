define(
    ['jquery', 'bootstrap'],
    function () {
        var modalMarkup = '<div class="modal fade">' +
            '  <div class="modal-dialog">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header">' +
            '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '        <h4 class="modal-title">Single Movie ID</h4>' +
            '      </div>' +
            '      <div class="modal-body">' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>',
            buttonMarkup = '<button type="button" class="btn"></button>';
 
        var show = function (options) {
            var modal = $(modalMarkup);
            /*
            if (!options.close) {
                modal.find('.close').remove();
            }
            */
            if (options.title) {
                modal.find('.modal-title').html(options.title);
            }
            if (options.body) {
                modal.find('.modal-body').html(options.body);
            }
            if (options.buttons) {
                var footer = $('<div class="modal-footer"></div>');
                for (var i = 0; i < options.buttons.length; i++) {
                    var b = options.buttons[i];
                    var button = $(buttonMarkup);
                    if (b.text) {
                        button.text(b.text);
                    }
                    if (b.class) {
                        button.addClass(b.class);
                    }
                    if (b.dismiss) {
                        button.attr('data-dismiss', 'modal');
                    }
                    if (b.click) {
                        button.on('click', b.click);
                    }
                    footer.append(button);
                }
                modal.find('.modal-content').append(footer);
            }
 
            return modal
                .appendTo('body')
                .modal('show')
                .on('hidden.bs.modal', function () {
                    modal.remove();
                });
        };
 
        var confirm = function (options) {
            return show({
                title: options.title,
                body: options.body,
                buttons: [
                    { text: 'Cancel', dismiss: true, 'class': 'btn-default' },
                    { text: 'OK', dismiss: true, 'class': 'btn-primary', click: options.ok }
                ]
            });
        };
 
        return {
            show: show,
            confirm: confirm
        };
    });