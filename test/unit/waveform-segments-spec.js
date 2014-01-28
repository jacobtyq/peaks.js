define(['main', 'jquery', 'underscore', 'Kinetic'], function(peaks, $,  _, Kinetic){

  describe("player/waveform/waveform.segments", function () {

    var fixtures = jasmine.getFixtures();
    fixtures.fixturesPath = 'base/test/';
    fixtures.preload('audioElement.html.js');

    var sandbox;

    beforeEach(function(){
      var ready = false;
      sandbox = sinon.sandbox.create();

      runs(function () {
        fixtures.load('audioElement.html.js');
        $("#audioElement")[0].src = 'base/test_data/sample.mp3';
      });

      waitsFor(function () {
        return $("#audioElement")[0].readyState == 4;
      }, "Audio Element should have loaded", 5000);

      runs(function () {
        peaks.init({
          container: document.getElementById('waveform-visualiser-container'),
          audioElement: document.getElementById('audioElement'),
          dataUri: 'base/test_data/sample.dat',
          keyboard: true,
          height: 240
        });

        setTimeout(function () { // Should be reworked so that Peaks emits a ready event
          ready = true;
        }, 1000);
      });

      waitsFor(function () {
        return ready;
      }, "Peaks should initialise", 2000);
    });

    afterEach(function(){
      var audioElement = document.getElementById("audioElement");

      audioElement.pause();
      audioElement.src = '';

      sandbox.restore();
    });

    describe("addSegment", function(){
      it("should accept spreaded arguments (soon deprecated)", function(){
        var stub = sandbox.stub(peaks.waveform.segments, 'createSegment');

        peaks.segments.addSegment(0, 10, false);

        expect(stub.calledOnce).toBe(true);
        expect(stub.args[0]).toEqual([0, 10, false, undefined, undefined]);
      });

      it("should accept an array of Segment objects", function(){
        var spy = sandbox.spy(peaks.waveform.segments, 'createSegment');

        peaks.segments.addSegment([
          { startTime: 0, endTime: 10, editable: false },
          { startTime: 10, endTime: 20, editable: true, color: 'rgba(255, 161, 39, 1)', labelText: 'dummy text'}
        ]);

        expect(spy.calledTwice).toBe(true);
        expect(spy.args[1]).toEqual([10, 20, true, 'rgba(255, 161, 39, 1)', 'dummy text']);
      });

      it("should paint once, and not after each segment addition", function(){
        var spy = sandbox.spy(peaks.waveform.segments.views[0].segmentLayer, 'draw');

        peaks.segments.addSegment([
          { startTime: 0, endTime: 10, editable: false },
          { startTime: 10, endTime: 20, editable: true, color: 'rgba(255, 161, 39, 1)', labelText: 'dummy text'}
        ]);

        expect(spy.calledOnce).toBe(true);    // currently called as many times as we have segments
      });
    });
  });

});