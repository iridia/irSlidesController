//	lib.irSlidesController.js
//	Evadne Wu at Iridia, 2010





	window.iridia = (window && window.iridia || {});
	
	
	
	
	
	
	
	
	
	
	iridia.slidesControllerDelegate = new JS.Interface([
	
		/* (void) */ "slideWillAppear" /* (slideController, theSlide) */,
		/* (void) */ "slideDidAppear" /* (slideController, theSlide) */,
		
		/* (void) */ "slideWillDisappear" /* (slideController, theSlide) */,
		/* (void) */ "slideDidDisappear" /* (slideController, theSlide) */,
		
		/* (Boolean) */ "slidesControllerShouldShowSlide" /* (slideController, theSlide) */
	
	]);
	
	
	
	
	
	
	
	
	
	
	iridia.slidesControllerSlidePresets = {
	
		layout: {
		
			vertical: function () {
			
				
			
			}
		
		},
		
		slideFocus: {
		
		},
		
		slideBlur: {
		
		}
	
	};
	
	
	
	
	
	
	
	
	
	
	iridia.slidesControllerSlide = new JS.Class({
	
		initialize: function (options) {
		
			this.options = $.extend(jQuery.kDeepCopyEnabled, {
			
				name: "",
				manifestObject: undefined,
				contextInfo: undefined
			
			}, options);
		
		}
	
	});
	
	
	
	
	
	
	
	
	
	
	iridia.slidesController = new JS.Class({
	
		/* (void) */ initialize: function (options) {
		
			this.slides = [];
			
			this.options = $.extend(jQuery.kDeepCopyEnabled, {

				container: undefined,
		
				slides: [],
				
				layout: this.presets.layout.vertical,
				
				onSlideBlur: irSlidesController.presets.slideFocus.fadeOut,
				onSlideFocus: irSlidesController.presets.slideFocus.fadeIn,
				
				initializeImmediately: true
		
			}, options);
		
		},
		
		
		
		
		
	//	! 
	//	!Behavior, Properties and Introspection
	
		/* (void) */ start: function () {
		
			
		
		},
		
		/* (void) */ stop: function () {
		
			
		
		},
		
		/* (Boolean) isAnimating */ isAnimating: function () {
		
			
		
		},
		
		/* (iridia.slidesControllerSlide) theSlideOrNil */ getCurrentSlide: function () {
		
			
		
		},
	
		/* (Boolean) setSucceeded */ setCurrentSlide: function (slideIndex, animated, stopsAfterTransition) {
		
			
		
		},
		
		
		
		
	
	//	! 	
	//	!Delegation	
		
		/* (void) */ setDelegate: function(inObject) {
		
			try {
			
				JS.Interface.ensure(inObject, iridia.slidesControllerDelegate);
			
			} catch (exception) {
			
				return mono.die(mono.error(exception));
			
			}
			
			this.delegate = inObject;
			
		},
		
		
		
		
		
	//	! 
	//	!Geometry
	
		/* (void) */ layoutSlides: function () {
		
			
		
		}
	
	});




