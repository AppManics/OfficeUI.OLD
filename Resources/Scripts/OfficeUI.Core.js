// Provides the core functions for the workings of the OfficeWebControls.
var OfficeUICoreInternal = {
  
  // Enables the next available tab (except the application tab).
  EnableNextTab: function() {
    OfficeUICoreAPI.EnableTab($($("li[role=tab].active").next()).Id());
  },

  // Enables the previous available tab (except the application tab).
  EnablePreviousTab: function() {
    OfficeUICoreAPI.EnableTab($($("li[role=tab]:not([role=application]).active").prev()).Id());
  },

  // Enable the menu for a given icon.
  //  Parameters:
  //    Timekey: The duration it takes to slide down the element., 
  //    Elementkey: The element on which the "active" class should be set. 
  EnableMenu: function(time, element) {
    // Check if the menu is closed. If that's the case, we should show it.
    if(!$(element).data("state") || $(element).data("state") == 0) { 
      $(element).show("slide", { direction: "up" }, time).Activate();

      // Update the current state.
      $(element).data("state", 1);

    // Menu is visible, so let's close it.
    } else if ($(element).data("state") == 1) {
      // Disables all the menuitems, so that when you request the menu again, it's initial state is loaded.
      $(".menu").each(function() {
          $(this).hide().parent().Deactivate();
      });

      OfficeUICoreInternal.DisableMenu($(element));
    }
  },

  // Disables a menu.
  //  Parameters:
  //      element:    The element (menu) that should be hidden.
  DisableMenu: function(element) {
    $(element).hide().Deactivate();
      
    // Update the state.
    $(element).data("state", 0);
  },

  // Add's all the events handlers for the application.
	AddGlobalHandlers: function() {
	
	  // Events handlers are placed here.
	
      // This event handler is executed when you click on the document.
      $(document).click(function() {
        // The ribbon can contain items that shows a menu when you click on the icon.
        // This menu should be hidden again when you click anywhere on the document.
        $(".menu").each(function() {
          $(this).hide().parent().Deactivate();
          $(this).data("state", 0);
        });
      });

      // Executed when you click on any icon which is not disabled.
      $(".icon").on("click", function(e) {
        if (!$(this).hasClass("disabled")) { // Check if the icon is not disabled. This is needed because items can be disabled on the fly.
          if ($(this).HoldsMenu()) { // Check if it's a menu.
              e.stopPropagation();
              $(this).Activate();
              OfficeUICoreInternal.EnableMenu(100, $(".menu", this).first());
           }
         } 
      });

	    // Bind the event for changing tabs on mouse scroll. 
      // We'll notice 2 events here. This is because the one ony work in Firefox, while the others are for all the browsers.
	    $(".ribbon").on('DOMMouseScroll mousewheel', function(e){
        	if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) { OfficeUICoreInternal.EnableNextTab($(this)); }
        	else { OfficeUICoreInternal.EnablePreviousTab($(this));	}

        	//prevent page fom scrolling
        	return false;
    	});

      // Section: Submenu handling. 

        // Open up the submenu when you hover on the item that holds the submenu.
        $("LI.menuEntry").on("click mouseenter", function(e) {
          e.stopPropagation();
          // Check if the item holds a submenu.
          if ($(".subMenuHolder", this).length > 0) {
            var element = $(this);
            waitHandle = setTimeout(function() {
            
              $(".menu", $(element).parent()).each(function() {
                $(this).hide().parent().Deactivate();
              });

              $(".menu", element).first().show("slide", { direction: "left" }, 100).Activate(); // Always shows the menu. Never hide it on a hover.

            }, 500);
          } else { // The item is not holding any submenu, so we can hide every open submenu.
            $(".menu", $(this).parent()).each(function() {
              $(this).hide().parent().Deactivate();
            });
          }
        });

        // Executed when the menuentry is left.
        $("LI.menuEntry").on("mouseout", function(e) {
          clearTimeout(waitHandle);
        });

      // End - Section: Submenu handling.

      // Section: Experimental code.

        // When you click on a menu that has an subMenu which is active, don't hide the menu.
        

        //$("LI.menuEntry").on("mouseover", function(e) {
        //  if ($(this).find(".menu").length > 0) {
        //    $(this).addClass("active");
        //    if (!$(".menu", this).is(":visible")) {
        //      $(".menu", this).show("slide", { direction: "left" }, 100);
        //    }
        //  } else {
        //    if ($(this).parents(".menuEntry.active").length == 0) {
        //      $(".subMenuArrow > .menu").hide();
        //      console.log("Everything should be hidden right now.");
        //    }
        //  }
        //});

      // End - Section: Experimental code.
	} 
} 

var OfficeUICore = {

	/** Initialize an element and its descendants.
	 * The initialization is done by placing classes automatticly on the necessary elements.
	 * That way the HTML is cleaner.
	 */
	InitElement: function() {		
		$(".ribbon, .tabs").addClass("brd_btm_grey"); // Place a gray bottem line under the ribbon and under the tabs.
		$(".tabs UL, .menucontents UL").addClass("nopadding nomargin"); // Make sure that on the tabs and the menucontents, there is no padding and no margin.
		$(".menucontents UL LI").addClass("nowrap"); // Make sure that text is not wrapped in the menucontents.
		$("li[role='tab']").addClass("inline"); // Make sure that every tab is displayed inline.
		OfficeUICoreAPI.EnableTab($("li[role='tab']:not(.application)").first().Id()); // Enable the first, non-application tab.
		$("li[role='tab'] span:first-child").addClass("uppercase"); // Make sure that the text of the tabs is always in uppercase.
		$("li[role='tab'] .contents").addClass("absolute"); // Make sure that the contents of the tab are displayed absolute.
    $(".group").after("<div class='seperator'>&nbsp;</div>");
		$(".group, .seperator").addClass("relative inline"); // Make sure that the seperator are relative placed and inline.
		$(".icongroup, .smallicon .iconlegend, .imageHolder, .menuItem").addClass("inline"); // Make sure that iconsgroups, smallicons, iconlegend, imageholder and menuholder are displayed inline.
		$(".bigicon").addClass("icon relative inline center"); // Make sure that a bigicon is displayed as an icon, relative, inline and centered.
		$(".smallicon").addClass("icon relative") // Make sure that a smallicon is displayed as an icon, relative.
		$(".legend, .menu").addClass("absolute"); // Make sure that the legend and the menu's are displayed absolute.
		$(".arrow").addClass("relative"); // Make sure that an arrow is placed as relative.
		$(".breadcrumbItem:not(:last-child)").after('<i class="fa fa-caret-right"></i>'); // Make sure that every item in the breadcrumb there is an arrow, except the last one.
		$('.menucontents ul li.line').after('<li style="height: 1px; background-color: #D4D4D4; margin-left: 25px; "></li>'); // Make sure that in a menuitem, on an li with the class "line" a line is added.

		// When you click on a tab element (not the first element, since that's the application), make sure the contents are coming available.
		$("li[role=tab]:not(.application)").click(function() {
			OfficeUICoreAPI.EnableTab($(this).Id());
		});

		// Set the remaing height of the contents, acoording to the window size.
		$(".main_area").height($(window).height() - 25 - 118 - 25 - 26);

		// Make sure that the contents are resized when the window is resized.
		$(window).resize(function() {
		  	$(".main_area").height($(window).height() - 25 - 118 - 26);
		});
	},
		
  /** Initialize the OfficeUI controls which are on the page. */
  Init: function() {
	 OfficeUICore.InitElement();
	 OfficeUICoreInternal.AddGlobalHandlers();
  }
}