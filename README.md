#	irSlideshowController

There’s nothing to see here — yet.  Move on.  ;)





##	Miscellany

	shouldStartSlideshow
	
	initWithOptions({
	
		container: (jQuerySelectorstring) theContainer,	
		presets: (IRSlideshowPresets)
		
	});
	
	
	
	
	
	Nota
	
		per-photograph preset, e.g. better control over per-image transition
		
		global preset
		
		
		
		
		
		Ideally / a working idea is to make a default, global preset, and allow the user to specify both a custom global preset (a subset of available configurations) and a per-photograph preset that might override the global preference
		
		
		
		
		
	
	
	
	
	
//	irSlidesController.initWithOptions({

		container: jQuerySelectorString

		slides: [{}, {}, {}, {}],
		
		layout: irSlideshowEngine.presets.layout.vertical,
		
		onSlideBlur: irSlidesController.presets.slideFocus.fadeOut,
		onSlideFocus: irSlidesController.presets.slideFocus.fadeIn,
		
		initializeImmediately: true

	});





//	fadeOut -> slide fades out










	fadeIn -> slide fades in
	
	and on each slide advancement / devancement we make sure that the container scrolls to the new slide (no scaling)





//	Assumptions
	
	the viewport is a giant plane and everything is laid on it.  there is NO MAGNIFICATION.  scaling the viewport should cause everything to be re-laid by calling `irSlideshowEngine.layoutSlidesIfNeeded`.
		
	
	
	
	
	this.slides = [ ]
	
		{
		
			name: name
			manifestObject: (jQuery element reference)
			contextInfo: (anything)
		
		}
	
	
	
	
	
	
	
	
	layoutSlides: function () {

	//	Lays the slides out.  This function calls thisObject.layout on each slide passing the index of the slide with the engine (helps figure out the right dimensions when it comes to positioning), and an optional contextInfo so that a custom layout algorithm function can better figure out the right location.  The layout function must return a hash that conforms to { top: originTop, left: originLeft } so that the slide is resized correctly.

		$.each(this.slides, function (indexOfSlide, slideObject) {
		
			slideObject.manifestObject.stop(true, true);
			
			var originalSlidePosition = {
			
				"top": slideObject.manifestObject.position().top,
				"left": slideObject.manifestObject.position().left
			
			}
			
			var plausibleSlidePosition = thisObject.layout(indexOfSlide, thisObject, slideObject.contextInfo);
			
			var finalSlidePosition = {
			
				"top": parseFloat((plausibleSlidePosition && plausibleSlidePosition.top), 10) || originalSlidePosition.top,				
				"left": parseFloat((plausibleSlidePosition && plausibleSlidePosition.left), 10) || originalSlidePosition.left
			
			}
			
			slideObject.animate(thisObject.slideTransitionInterval, finalSlidePosition);
		
		});
	
	}
	
	
	
	
	
	
	
	
	
	
	IRSlidesControllerDelegate
	
	one-way void slideWillAppear(inSlideController, inSlide)
	one-way void slideDidAppear(inSlideController, inSlide)
	
	one-way void slideWillDisappear(inSlideController, inSlide)
	one-way void slideDidDisappear(inSlideController, inSlide)
	
	Boolean slidesControllerShouldShowSlide(inSlideController, inSlide)
	
	
	
	
	
	properties
	
	IRSlidesControllerSlide currentSlide

		//	this property is a wrapper around thisObject.getCurrentSlide and thisObject.setCurrentSlide.
	
	Boolean isPlaying
	
	
	
	
	
	public methods
	
	start
	stop
	
	IRSlidesControllerSlide getCurrentSlide
	Boolean setCurrentSlide(theIndex, animated, stopsAfterTransition)
	
		//	We can’t really pass objects here because JavaScript does not have native object hashing.  animated defaults to true and stopsAfterTransition defaults to false.
	
	


