//	lib.irSlidesController.js
//	Evadne Wu at Iridia, 2010





	JS.require("jQuery.event.special.load", "jQuery.scrollTo");
	
	
	
	
	
	window.iridia = (window && window.iridia || {});
	
	
	
	
	
	
	
	
	
	
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
		
			/* (iridia.slidesControllerSlideLayoutMatrix) */ alongX: function (plausiblePadding) {
			
				if (!(plausiblePadding = Number(plausiblePadding)))
				plausiblePadding = 32;
			
				var theMatrix = new iridia.slidesControllerSlideLayoutMatrix();
				
				$.each(this.slides, function (indexOfSlide, theSlide) {
				
					theMatrix.pushSlide(theSlide, (theMatrix.getBounds().width + plausiblePadding), 0);
				
				});
				
				return theMatrix;
			
			},
			
			/* (iridia.slidesControllerSlideLayoutMatrix) */ alongY: function (plausiblePadding) {
			
				if (!(plausiblePadding = Number(plausiblePadding)))
				plausiblePadding = 32;
			
				var theMatrix = new iridia.slidesControllerSlideLayoutMatrix();
				
				$.each(this.slides, function (indexOfSlide, theSlide) {
				
					theMatrix.pushSlide(theSlide, 0, (theMatrix.getBounds().width + plausiblePadding));
				
				});
				
				return theMatrix;
			
			}
		
		},
		
		slideTransitions: {
		
			/* (void) */ fadeIn: function (theSlide) {
			
				theSldie.manifestObject.stop(true, true).fadeTo(250, 1);
			
			},
			
			/* (void) */ fadeOut: function (theSlide) {
			
				theSldie.manifestObject.stop(true, true).fadeTo(250, 0);
			
			}
		
		}
	
	};
	
	
	
	
	
	
	
	
	
	
	iridia.slidesControllerSlide = new JS.Class({

		include: JS.Delegatable,
		
		extend: {
		
			delegateProtocol: new JS.Interface([
			
				/* (void) */ "slideWillLoad",
				/* (void) */ "slideDidFinishLoading",
				/* (void) */ "slideFailedLoading"
			
			])
		
		},
	
		initialize: function (options) {
		
			this.options = $.extend(jQuery.kDeepCopyEnabled, {
			
				name: "",
				manifestObject: null,
				payloadType: "image",
				payloadResource: null,
				contextInfo: null
			
			}, options);
			
			this.slideReady = false;
			
			if (this.options.payloadResource !== null)
			this.loadContent();
		
		},
		
		loadContent: function () {
		
		//	Assume payload is image
		
			var thisObject = this;
			
			$("<img>").attr("src", thisObject.options.payloadResource).bind("load", (function () {
			
				return function () {
				
					thisObject.imageDidLoad.call(thisObject, arguments);
				
				}
			
			})()).appendTo(thisObject.manifestObject);
		
		},
		
		imageDidLoad: function (event) {
		
			this.slideReady = true;
			
			this.delegate.slideDidLoad(this, this.options.contextInfo);
		
			if (this.delegate.slideShouldShow(this))
			this.delegate.transitionIfAppropriate();
		
		}
	
	});
	
	
	
	
	
	
	
	
	
	
	iridia.slidesController = new JS.Class({
	
		include: JS.Delegatable,
		extend: {
		
			delegateProtocol: new JS.Interface([
	
				/* ([iridia.slidesControllerSlides, …]) */ "slidesForController" /* (slideController) */,
			
				/* (void) */ "slideWillAppear" /* (slideController, theSlide) */,
				/* (void) */ "slideDidAppear" /* (slideController, theSlide) */,
				
				/* (void) */ "slideWillDisappear" /* (slideController, theSlide) */,
				/* (void) */ "slideDidDisappear" /* (slideController, theSlide) */,
				
				/* (Boolean) */ "slidesControllerShouldShowSlide" /* (slideController, theSlide) */
			
			])
		
		},
		
		
		
		
		
		/* (void) */ initialize: function (inOptions, inDelegate) {
		
			this.options = $.extend(jQuery.kDeepCopyEnabled, {

				containerElement: undefined,
				
				layout: iridia.slidesControllerSlidePresets.layout.alongX,
				
				onSlideBlur: iridia.slidesControllerSlidePresets.slideTransitions.fadeIn,
				onSlideFocus: iridia.slidesControllerSlidePresets.slideTransitions.fadeOut,
				
				initializeImmediately: true
		
			}, inOptions);
			
			this.setDelegate(inDelegate);
			
			this.slides = this.delegate.slidesForController(this);

			this.currentSlideHash = undefined;
			this.promisedSlideHash = undefined;
			
			this.layoutIfNeeded();
			this.transitionIfAppropriate();
		
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
	//	!Geometry
	
		/* (void) */ layoutIfNeeded: function () {
		
			
		
		},
	
	
	
	
	
	//	! 
	//	!Slides Switching
	
		transitionIfAppropriate: function () {
		
			
		
		}
	
	});




