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
			
			this.contentStore = null;
			
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
		
			this.contentStore = $("<img>");
			var thisObject = this;
			this.delegate.slideWillLoad(this, this.options.contextInfo);
			
			thisObject.contentStore.hide().appendTo("body").hide().bind("load", function () {
			
				thisObject.imageDidLoad.call(thisObject, event);
			
			}).attr("src", thisObject.options.payloadResource);
		
		},
		
		imageDidLoad: function (event) {
		
			this.slideReady = true;
			this.contentStore.show().appendTo(this.options.manifestObject);			
			this.delegate.slideDidFinishLoading(this, this.options.contextInfo);
		
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
				
				layout: iridia.slidesControllerSlidePresets.layout.stacked,
				
				onSlideFocus: iridia.slidesControllerSlidePresets.slideTransitions.fadeIn,
				onSlideBlur: iridia.slidesControllerSlidePresets.slideTransitions.fadeOut,
				
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
			this._startTimer();
		
		},
		
		/* (void) */ stop: function () {
		
			mono.log("Slides controller stopping");
			this._stopTimer();
		
		},
		
		/* (Boolean) isAnimating */ isAnimating: function () {
		
			return (this._timer == undefined);
		
		},
		
		/* (iridia.slidesControllerSlide) theSlideOrNil */ getCurrentSlide: function () {
		
			return this.currentSlideIndex;
		
		},
	
		/* (Boolean) setSucceeded */ setCurrentSlide: function (slideIndex, animated, stopsAfterTransition) {
		
			if (stopsAfterTransition) this.stop();
		
			this.promisedSlideIndex = slideIndex;
			this.transitionIfAppropriate();
			
		},
		
		
		
		
	
	//	! 
	//	! Preparing manifest object
	
		emptyManifestObject: function () {
				
			this.options.containerElement.find("> *").not("[irSlidesControllerConfiguration*='ignore']").remove();
		
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
		
			this.promisedSlideIndex ++;
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
		
			this.promisedSlideIndex = this.promisedSlideIndex || 0;
		
			var destinationSlide = this.slides[this.promisedSlideIndex % this.slides.length];
			
			if (!this.delegate.slidesControllerShouldShowSlide(this, destinationSlide)) return;
						
			if (!destinationSlide.slideReady) return;
			
			this.transitionToSlide(destinationSlide);
		
		},
		
		/* (void) */ transitionToSlide: function (destinationSlide) {
		
			mono.log("Transitioning to slide", destinationSlide);

			if (this.slides[this.currentSlideIndex]	!= undefined)
			this.delegate.slideWillDisappear(this, this.slides[this.currentSlideIndex]);
			
			this.options.onSlideBlur(this.slides[this.currentSlideIndex || 0]);
			
			if (this.slides[this.currentSlideIndex]	!= undefined)
			this.delegate.slideDidDisappear(this, this.slides[this.currentSlideIndex]);
			
			
			destinationSlide.options.manifestObject.stop(false, true);
			
			
			if (destinationSlide != undefined)
			this.delegate.slideWillAppear(this, destinationSlide);

			this.options.onSlideFocus(destinationSlide);
			
			if (destinationSlide != undefined)
			this.delegate.slideDidAppear(this, destinationSlide);
			
			
			this.options.containerElement.scrollTo(destinationSlide.options.manifestObject, 250);
			
			this.currentSlideIndex = this.slides.indexOfObject(destinationSlide);
		
		},
		
		
		
		
		
	//	! 
	//	! Slide Delegation
	
		/* (void) */ slideWillLoad: function (slide) {
		
			
		
		},
		
		/* (void) */ slideDidFinishLoading: function (slide) {
		
			iridia.slidesControllerSlidePresets.slideTransitions.fadeOut(slide);
			slide.options.manifestObject.stop(false, true);
			
			this.options.containerElement.removeClass("loading");
			this.transitionIfAppropriate();
		
		},

		/* (void) */ slideFailedLoading: function () {
		
			
		
		}
	
	});




