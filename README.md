# Progress Bar Button
Author: Andries Smit, Flock of Birds

Type: Widget
Latest Version: 1.0
Package file name: Progress Bar Button.mpk

## Description

Send progress feedback to user interface when processing takes long.

A microflow button widget that shows progress messages and a progress bar during the  processing of microflows. In the MF the messages and percentage can be updated and are show to the user directly.

## Typical usage scenario

* Send user messages on progress
* Send user percentage progress
* Cancel long processes. (if supported by the process MF)

## Features and limitations

* Static and dynamic progress messages
* Moving progress bar Percentage. (updated via MF) 
* Buttons and Links with static and dynamic captions. (sorry no templating, yet)
* Buttons with images, tool tips and bootstrap styles.
* Add a confirmation before start of the processing MF
* Cancel your processing (if you server processing supports it)

## Installation

See the general instructions under _How to Install._

## Dependencies

* Mendix 5 Environment. Tested on 5.14.1 and 5.20


## Configuration

* Create a non persistable entity for the Progress Messages "Progress"
 * Add String "Message" attribute
 * Add Integer "Percentage" attribute
 * Add Boolean "CancelProcessing" attribute
* Create a on click [processing Microflow "IVK_OnClick"](https://modelshare.mendix.com/models/63362fac-3e0e-4dfa-9d76-5d290c9a441e/progress-bar-on-click)
 * Add "Progress" object input parameter
 * Add your context object input parameter
 * Change the "Progress" object and set the "CancelProcessing" attribute to false (if cancel is supported)
 * Add Change Object for the "Progress" object to change the message and percentage
 * If cancel is supported, Add regular check  if the "Progress" object "CancelProcessing" attribute is set
* Create a on [Update Message Microflow "ResfreshProgressMessage"](https://modelshare.mendix.com/models/29086e36-69e9-47c3-a3f4-090cbdb8cf06/progress-bar-resfresh-progress-message)
 * Add "Progress" object input parameter
 * Return the "Progress" object. (no update is needed)
* Create a on click [Cancel Microflow](https://modelshare.mendix.com/models/4674e539-e58d-4469-957b-25080140c8b6/progress-bar-cancel-progress) (if cancel is supported)
 * Add "Progress" object input parameter
 * Change the "Progress" object and set the "CancelProcessing" attribute to true

## Properties

* Appearance
  * Caption; Caption of the button (can be empty)
  * Tool Tip; Button Tooltip
  * Caption Attribute; Caption based on attribute
  * Image; The Image shown in the button in front of the caption
  * Button Style; The Boodstrap rendered style, or as link
* Behaviour
  * On Click MF: Click microflow name (module.mfname). Should have 2 input params (Context and Progress entity)
  * Cancel MF; A microflow that cancels the long operation after start.
  * Asynchronous; The client executes the microflow and starts polling to determine whether the microflow is done executing.
  * Blocking; end user must wait until the microflow is done.
  * Validate form; This will prevent the microflow from executing on all validation errors.
* Progress:
  * Setting Entity;
  * Progress Message; Static Progress message
  * Progress Message att; Attribute of the progress message
  * Progress % att; When set a progress bar is show when column, row or data is clicked
* Confirmation:
  * Ask Confirmation; ask for confirmation before proceeding with the microflow
  * Question; the question for confirmation
  * Proceed button caption;
  * Cancel button caption;

## Source

Source and [Sample projects](https://github.com/Andries-Smit/Mx-Progress-Bar-Button/tree/master/test) at GitHub

Please contribute fixes and extensions at
https://github.com/Andries-Smit/Mx-Progress-Bar-Button


## Known bugs

* None so far; please let me know when there are any issues or suggestions.

Please report any issues via the github issue tracker:
https://github.com/Andries-Smit/Mx-Progress-Bar-Button/issues
