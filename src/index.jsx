import { h, render, Component } from 'preact';
import * as cornerstone from '@cornerstonejs/core';
import { volumeLoader } from '@cornerstonejs/core';
import dicomParser from 'dicom-parser';
import { api } from 'dicomweb-client';
import dcmjs from 'dcmjs';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import {
	cornerstoneStreamingImageVolumeLoader,
	cornerstoneStreamingDynamicImageVolumeLoader,
} from '@cornerstonejs/streaming-image-volume-loader';

class App extends Component {
	async componentDidMount() {
		await cornerstone.init();
		this.initCornerstoneDICOMImageLoader();
		this.initVolumeLoader();


// Get Cornerstone imageIds and fetch metadata into RAM
// const imageIds = await this.createImageIdsAndCacheMetaData({
//   StudyInstanceUID:
//     '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
//   SeriesInstanceUID:
//     '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
//   wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb',
// });

const imageIds = [
	'wadouri:/test.dcm',
];

const content = document.getElementById('content');

const viewportGrid = document.createElement('div');
viewportGrid.style.display = 'flex';
viewportGrid.style.flexDirection = 'row';

// element for axial view
const element1 = document.createElement('div');
element1.style.width = '500px';
element1.style.height = '500px';

// element for sagittal view
const element2 = document.createElement('div');
element2.style.width = '500px';
element2.style.height = '500px';

viewportGrid.appendChild(element1);
viewportGrid.appendChild(element2);

content.appendChild(viewportGrid);

const renderingEngineId = 'myRenderingEngine';
const renderingEngine = new cornerstone.RenderingEngine(renderingEngineId);

// note we need to add the cornerstoneStreamingImageVolume: to
// use the streaming volume loader
const volumeId = 'cornerstoneStreamingImageVolume: myVolume';

// Define a volume in memory
const volume = await volumeLoader.createAndCacheVolume(volumeId, {
  imageIds,
});

const viewportId1 = 'CT_AXIAL';
const viewportId2 = 'CT_SAGITTAL';

const viewportInput = [
  {
    viewportId: viewportId1,
    element: element1,
    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
    defaultOptions: {
      orientation: cornerstone.Enums.OrientationAxis.AXIAL,
    },
  },
  {
    viewportId: viewportId2,
    element: element2,
    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
    defaultOptions: {
      orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
    },
  },
];

renderingEngine.setViewports(viewportInput);

// Set the volume to load
volume.load();

cornerstone.setVolumesForViewports(
  renderingEngine,
  [{ volumeId }],
  [viewportId1, viewportId2]
);

// Render the image
renderingEngine.renderViewports([viewportId1, viewportId2]);

	}

	initVolumeLoader() {
		volumeLoader.registerUnknownVolumeLoader(
			cornerstoneStreamingImageVolumeLoader
		);
		volumeLoader.registerVolumeLoader(
			'cornerstoneStreamingImageVolume',
			cornerstoneStreamingImageVolumeLoader
		);
		volumeLoader.registerVolumeLoader(
			'cornerstoneStreamingDynamicImageVolume',
			cornerstoneStreamingDynamicImageVolumeLoader
		);
	}


	initCornerstoneDICOMImageLoader() {
	  const { preferSizeOverAccuracy, useNorm16Texture } = cornerstone.getConfiguration().rendering;
	  cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
	  cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
	  cornerstoneDICOMImageLoader.configure({
	    useWebWorkers: true,
	    decodeConfig: {
	      convertFloatPixelDataToInt: false,
	      use16BitDataType: preferSizeOverAccuracy || useNorm16Texture,
	    },
	  });

	  let maxWebWorkers = 1;

	  if (navigator.hardwareConcurrency) {
	    maxWebWorkers = Math.min(navigator.hardwareConcurrency, 7);
	  }

	  var config = {
	    maxWebWorkers,
	    startWebWorkersOnDemand: false,
	    taskConfiguration: {
	      decodeTask: {
	        initializeCodecsOnStartup: false,
	        strict: false,
	      },
	    },
	  };

	  cornerstoneDICOMImageLoader.webWorkerManager.initialize(config);
	}


	/*
	 * This function just finds a bunch of instances given the input
	 * params and returns a list of direct URLs (it may also cache their
	 * data). It doesn't do anything else!
	 */
	async createImageIdsAndCacheMetaData({
	  StudyInstanceUID,
	  SeriesInstanceUID,
	  SOPInstanceUID = null,
	  wadoRsRoot,
	  client = null,
	}) {
	  const SOP_INSTANCE_UID = '00080018';
	  const SERIES_INSTANCE_UID = '0020000E';
	  const MODALITY = '00080060';

	  const studySearchOptions = {
	    studyInstanceUID: StudyInstanceUID,
	    seriesInstanceUID: SeriesInstanceUID,
	  };

	  client = client || new api.DICOMwebClient({ url: wadoRsRoot });
	  const instances = await client.retrieveSeriesMetadata(studySearchOptions);
	  const modality = instances[0][MODALITY].Value[0];
	  let imageIds = instances.map((instanceMetaData) => {
	    const SeriesInstanceUID = instanceMetaData[SERIES_INSTANCE_UID].Value[0];
	    const SOPInstanceUIDToUse =
	      SOPInstanceUID || instanceMetaData[SOP_INSTANCE_UID].Value[0];

	    const prefix = 'wadors:';

	    const imageId =
	      prefix +
	      wadoRsRoot +
	      '/studies/' +
	      StudyInstanceUID +
	      '/series/' +
	      SeriesInstanceUID +
	      '/instances/' +
	      SOPInstanceUIDToUse +
	      '/frames/1';

	    cornerstoneDICOMImageLoader.wadors.metaDataManager.add(
	      imageId,
	      instanceMetaData
	    );
	    return imageId;
	  });

	  return imageIds;
	}


	render() {
		return (
			<div>
				<p>hello world</p>
				<div id="content"></div>
			</div>
		)
	}
}

render(<App />, document.getElementById('app'));
