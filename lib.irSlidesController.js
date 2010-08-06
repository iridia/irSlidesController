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
				
					width: Math.max(knownBounds.width, slideMetaObject.offsetX + slideMetaObject.slide.getWidth()),
					height: Math.max(knownBounds.height, slideMetaObject.offsetY + slideMetaObject.slide.getHeight())
					
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
				
					theMatrix.pushSlide(theSlide, (theMatrix.getBounds().width + plausiblePadding), plausiblePadding);
				
				});
				
				return theMatrix;
			
			},
			
			/* (iridia.slidesControllerSlideLayoutMatrix) */ alongY: function (plausiblePadding) {
			
				if (!(plausiblePadding = Number(plausiblePadding)))
				plausiblePadding = 32;
			
				var theMatrix = new iridia.slidesControllerSlideLayoutMatrix();
				
				$.each(this.slides, function (indexOfSlide, theSlide) {
				
					theMatrix.pushSlide(theSlide, plausiblePadding, (theMatrix.getBounds().width + plausiblePadding));
				
				});
				
				return theMatrix;
			
			},
			
			/* (iridia.slidesControllerSlideLayoutMatrix) */ stacked: function () {
			
				var theMatrix = new iridia.slidesControllerSlideLayoutMatrix();
				
				$.each(this.slides, function (indexOfSlide, theSlide) {
				
					theMatrix.pushSlide(theSlide, 0, 0);
				
				});
				
				return theMatrix;
			
			}
		
		},
		
		slideTransitions: {
		
			/* (void) */ fadeIn: function (theSlide) {
			
				theSlide.options.manifestObject.stop(true, true).fadeTo(250, 1);
			
			},
			
			/* (void) */ fadeOut: function (theSlide) {
			
				theSlide.options.manifestObject.stop(true, true).fadeTo(250, 0);
			
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
	
		initialize: function (inOptions, inDelegate) {
		
			this.extend(JS.Delegatable);
		
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
			
			//	Fixme: wrap it within a selector-string-debated element?
			
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
	
		extend: {
		
			delegateProtocol: new JS.Interface([
	
				/* ([iridia.slidesControllerSlides, …]) */ "slidesForController" /* (slideController) */,
			
				/* (void) */ "slideWillAppear" /* (slideController, theSlide) */,
				/* (void) */ "slideDidAppear" /* (slideController, theSlide) */,
				
				/* (void) */ "slideWillDisappear" /* (slideController, theSlide) */,
				/* (void) */ "slideDidDisappear" /* (slideController, theSlide) */,
				
				/* (Boolean) */ "slidesControllerShouldShowSlide" /* (slideController, theSlide) */,
				
				/* ([(Number) width, (Number) height]) */ "defaultSlideSize" /* (slideController) */
			
			])
		
		},
		
		
		
		
		
		/* (void) */ initialize: function (inOptions, inDelegate, inContextInfo) {
		
			this.extend(JS.Delegatable);
		
			this.options = $.extend(jQuery.kDeepCopyEnabled, {

				containerElement: undefined,
				childrenElementSelectorString: "li",
				
				layout: iridia.slidesControllerSlidePresets.layout.alongX,
				
				onSlideBlur: iridia.slidesControllerSlidePresets.slideTransitions.fadeIn,
				onSlideFocus: iridia.slidesControllerSlidePresets.slideTransitions.fadeOut,
				
				transitionInterval: 5000,
				
				initializeImmediately: true
		
			}, inOptions);
			
			this.contextInfo = inContextInfo;
			
			this.setDelegate(inDelegate);
			
			this.slides = [];
			
			var thisObject = this; 
			
			var defaultSlideSize = this.delegate.defaultSlideSize(this);
			
			this.slides = $.map(this.delegate.slidesForController(this), function (inObject) {
			
				var theSlide = new iridia.slidesControllerSlide(inObject, thisObject);
				
				theSlide.width = defaultSlideSize[0];
				theSlide.height = defaultSlideSize[1];
				
				return theSlide;
			
			});

			this.timer = null;

			this.currentSlideIndex = undefined;
			this.promisedSlideIndex = undefined;
			
			this.emptyManifestObject();
			
			this.layoutIfNeeded();
			this.transitionIfAppropriate();
		
		},
		
		
		
		
		
	//	! 
	//	!Behavior, Properties and Introspection
	
		/* (void) */ start: function () {
		
			mono.log("Slides controller starting");
		
		},
		
		/* (void) */ stop: function () {
		
			mono.log("Slides controller stopping");
		
		},
		
		/* (Boolean) isAnimating */ isAnimating: function () {
		
			return (this._timer == undefined);
		
		},
		
		/* (iridia.slidesControllerSlide) theSlideOrNil */ getCurrentSlide: function () {
		
			
		
		},
	
		/* (Boolean) setSucceeded */ setCurrentSlide: function (slideIndex, animated, stopsAfterTransition) {
		
			
		
		},
		
		
		
		
	
	//	! 
	//	! Preparing manifest object
	
		emptyManifestObject: function () {
		
			mono.log("Emptying manifest.");	
		
		},
		
		
		
		
		
	//	! 
	//	!Timer
	
		_startTimer: function () {
		
			this._stopTimer();
			this._timer = undefined;
			
			var thisObject = this;
			this._timer = window.setInterval(function () {
			
				thisObject._timerHandler.call(thisObject);
			
			}, this.options.transitionInterval);
		
		},
		
		_stopTimer: function () {
		
			if (this.timer === undefined) return;
		
			window.clearInterval(this._timer);
			this._timer = undefined;
		
		},
		
		/* (void) */ _setTimerInterval: function (inInterval) {
		
			this.options.transitionInterval = inInterval;
			
			if (this._timer === undefined) return;
			
			this._stopTimer();
			this._startTimer();
		
		},
		
		/* (void) */ _timerHandler: function () {
		
			this.transitionIfAppropriate();
		
		},
	
	
	
	
	
	//	! 
	//	!Geometry
	
		/* (void) */ layoutIfNeeded: function () {
		
		//	Create a layout matrix
	
			var finalLayout = this.options.layout.call(this);
			
			var thisObject = this;
			
			$.each(finalLayout.slides, function (slideIndex, slideObject) {
						
				slideObject.slide.options.manifestObject = $("<" + thisObject.options.childrenElementSelectorString + ">");

				slideObject.slide.options.manifestObject
				.css("left", slideObject.offsetX)
				.css("top", slideObject.offsetY);
				
				slideObject.slide.options.manifestObject
				.appendTo(thisObject.options.containerElement);
			
			});
					
		},
	
	
	
	
	
	//	! 
	//	!Slides Switching
	
		/* (void) */ transitionIfAppropriate: function () {
		
			var destinationSlide = this.slides[this.promisedSlideIndex % this.slides.length];
			
			if (!this.delegate.slidesControllerShouldShowSlide(this, destinationSlide)) return;
						
			if (!destinationSlide.slideReady) return;
			
			this.transitionToSlide(destinationSlide);
		
		},
		
		/* (void) */ transitionToSlide: function () {
		
		//	Get the next slide (may be a positive or negative increase in index count, then call upon the presets — before the transition.  transition use the correct preset function, then after the transition call the handler in the preset again.	
		
		}
	
	});




