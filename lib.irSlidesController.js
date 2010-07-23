//	lib.irSlidesController.js
//	Evadne Wu at Iridia, 2010





	JS.require("jQuery.event.special.load", "jQuery.scrollTo");
	
	
	
	
	
	window.iridia = (window && window.iridia || {});
	
	
	
	
	
	
	
	
	
	
	iridia.slidesControllerSlideLayoutMatrix = new JS.Class({
	
		initialize: function () {
		
			this.bounds = {
			
				width: 0,
				height: 0
			
			}
			
			this.slides = [];
		
		},
		
		/* ({width: Number, height: Number}) */ getBounds: function () {
		
			return {
			
				width: this.bounds.width || 0,
				height: this.bounds.height || 0
			
			}
		
		},
		
		/* (void) */ pushSlide: function (inSlide, inOffsetX, inOffsetY) {
		
			this.slides.push({
			
				slide: inSlide,
				offsetX: Number(inOffsetX) || 0,
				offsetY: Number(inOffsetY) || 0
			
			});
			
			this.calculateBounds();
		
		},
		
		/* (void) */ calculateBounds: function () {
		
			var knownBounds = {
			
				width: 0,
				height: 0
			
			};
		
			$.each(this.slides, function (indexOfSlide, slideMetaObject) {
			
				if (slideMetaObject.slide === undefined) return;				
				if (slideMetaObject.offsetX === undefined) return;
				if (slideMetaObject.offsetY === undefined) return;
				
				try {
				
					JS.Interface.ensure(slideMetaObject.slide, iridia.slidesControllerSlide.propertyProtocol);
				
				} catch (exceptionString) {
				
					mono.log("Slide", slideMetaObject.slide, "is not a nicely formatted slide, skipping.");
				
				}
			
				knownBounds = {
				
					width: Math.max(knownBounds.width, slideMetaObject.slide.offsetX + slideMetaObject.slide.getWidth()),
					height: Math.max(knownBounds.width, slideMetaObject.slide.offsetY + slideMetaObject.slide.getHeight())
					
				};
			
			});
			
			this.bounds = knownBounds;
		
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

		extend: {
		
			propertyProtocol: new JS.Interface([
			
				/* (Number) */ "getWidth",
				/* (Number) */ "getHeight"
			
			]),
		
			delegateProtocol: new JS.Interface([
			
				/* (void) */ "slideWillLoad",
				/* (void) */ "slideDidFinishLoading",
				/* (void) */ "slideFailedLoading"
			
			])
		
		},
	
		include: JS.Delegatable,
		
		initialize: function (inOptions, inDelegate) {
		
			this.options = $.extend(jQuery.kDeepCopyEnabled, {
			
				name: "",
				manifestObject: null,
				payloadType: "image",
				payloadResource: null,
				contextInfo: null
			
			}, inOptions);
			
			this.slideReady = false;
			this.setDelegate(inDelegate);
			
			this.width = null;
			this.height = null;
			
			if (this.options.payloadResource !== null)
			this.loadContent();
		
		},
		
		/* (Number) */ getWidth: function () {
		
			return this.width;
		
		},
		
		/* (Number) */ getHeight: function () {
		
			return this.height;
		
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
		
		
		
		
		
		/* (void) */ initialize: function (inDelegate, inOptions) {
		
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




