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
	
	
	
	
	
	
	
	
	
	
	iridia.slidesControllerSlideLayoutMatrix = new JS.Class({
	
		initialize: function () {
		
			this.__defineGetter__("bounds", this.getBounds);
		
		},
		
		/* ({width: Number, height: Number}) */ getBounds: function () {
		
			return {
			
				width: this.size.width || 0,
				height: this.size.height || 0
			
			}
		
		},
		
		/* (void) */ pushSlide: function (inSlide, inOffsetX, inOffsetY) {
		
			this.slides.push({
			
				slide: inSlide,
				offsetX: inOffsetX,
				offsetY: inOffsetY
			
			});
		
		}
	
	});
	
	
	
	
	
	iridia.slidesControllerSlidePresets = {
	
		layout: {
		
			/* (iridia.slidesControllerSlideLayoutMatrix) */ vertical: function () {
			
				var theMatrix = new iridia.slidesControllerSlideLayoutMatrix();
				
				$.each(this.slides, function (indexOfSlide, theSlide) {
				
					theMatrix.pushSlide(theSlide, theMatrix.getBounds().width + 32, 0);
				
				});
				
				return theMatrix;
			
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




