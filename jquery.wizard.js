/*
    jQuery Wizard Plugin
    Copyright (c) 2009 Hiroshi Kuwabara
    http://semooh.jp/jquery/sample/wizard/
    
    inspired by Anthony
    http://worcesterwideweb.com/2007/06/04/jquery-wizard-plugin/
    
    Licensed under the MIT license:
        http://www.opensource.org/licenses/mit-license.php

    Any and all use of this script must be accompanied by this copyright/license notice in its present form.
*/

(function($){
    $.fn.wizard = function(options) {
        var defaults = {
            onLoad: function () {},
            onChange: function () {}
        };
        var o = $.extend(defaults, options);

        return this.each(function() {
            new $.wizard(this, o);
        });
    };
    $.wizard = function (wrapper, options) {
        var self = this;
        this.options = options;
        this.contents = $('.jqwizard_panel', wrapper).children();
        this.navi_steps = $('.jqwizard_navi ul', wrapper).children();
        this.prev_button = $('.jqwizard_previous', wrapper);
        this.next_button = $('.jqwizard_next', wrapper);

        this.current_index = 0;
        this.max_index = this.navi_steps.length - 1;

        switch (this.max_index) {
            case 1:
                $('.jqwizard_navi', wrapper).addClass('jqwizard_navi_two_step');
                break;
            case 2:
                $('.jqwizard_navi', wrapper).addClass('jqwizard_navi_three_step');
                break;
            case 3:
                $('.jqwizard_navi', wrapper).addClass('jqwizard_navi_four_step');
                break;
            case 4:
                $('.jqwizard_navi', wrapper).addClass('jqwizard_navi_five_step');
                break;
            default:
                break;
        }
        this.navi_steps.eq(this.max_index).addClass('jqwizard_no_bg');

        this.prev_button.click(function () { self.loadprev(); });
        this.next_button.click(function () { self.loadnext(); });
        this.navi_steps.each(function (index, step) {
            $(step).click(function () {
                if ($(step).hasClass('jqwizard_done') || $(step).hasClass('jqwizard_lastdone'))
                    self.load(index);
            });
        });

        this.load(0);
        if (this.options.onLoad.constructor == Function)
            this.options.onLoad();
    };
    $.wizard.prototype.load = function (target_index) {
        var self = this;
        var current_index = this.current_index;
        var max_index = this.max_index;

        if (target_index > current_index + 1 || target_index > max_index || target_index < 0)
            return;

        if (target_index == 0) {
            this.prev_button.attr('disabled', true);
            this.next_button.attr('disabled', false);
        } else if (target_index == max_index) {
            this.prev_button.attr('disabled', false);
            this.next_button.attr('disabled', true);
        } else {
            this.prev_button.attr('disabled', false);
            this.next_button.attr('disabled', false);
        }

        this.navi_steps.each(function (index, step) {
            if (index < target_index - 1)
                $(step).removeClass('jqwizard_lastdone').addClass('jqwizard_done');
            else if (index == target_index - 1)
                $(step).removeClass('jqwizard_done').removeClass('jqwizard_current').addClass('jqwizard_lastdone');
            else if (index == target_index)
                $(step).removeClass('jqwizard_done').removeClass('jqwizard_lastdone').addClass('jqwizard_current');
            else
                $(step).removeClass('jqwizard_done').removeClass('jqwizard_lastdone').removeClass('jqwizard_current');
        });
        this.contents.eq(current_index).hide();
        this.contents.eq(target_index).fadeIn('fast');
        this.current_index = target_index;

        if (arguments.callee.has_been_called) {
            if (this.options.onChange.constructor == Function)
                this.options.onChange(current_index, self);
        } else {
            arguments.callee.has_been_called = true;
        }
    };
    $.wizard.prototype.loadnext = function () {
        if (this.current_index != this.max_index)
            this.load(this.current_index + 1);
    };
    $.wizard.prototype.loadprev = function () {
        if (this.current_index != 0)
            this.load(this.current_index - 1);
    };
})(jQuery);
