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

	// up to 115
	const imageIds = this.getTestImageIds();

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

	getTestImageIds() {
		return [
			'wadouri:/dicom/1-001.dcm',
			'wadouri:/dicom/1-002.dcm',
			'wadouri:/dicom/1-003.dcm',
			'wadouri:/dicom/1-004.dcm',
			'wadouri:/dicom/1-005.dcm',
			'wadouri:/dicom/1-006.dcm',
			'wadouri:/dicom/1-007.dcm',
			'wadouri:/dicom/1-008.dcm',
			'wadouri:/dicom/1-009.dcm',
			'wadouri:/dicom/1-010.dcm',
			'wadouri:/dicom/1-011.dcm',
			'wadouri:/dicom/1-012.dcm',
			'wadouri:/dicom/1-013.dcm',
			'wadouri:/dicom/1-014.dcm',
			'wadouri:/dicom/1-015.dcm',
			'wadouri:/dicom/1-016.dcm',
			'wadouri:/dicom/1-017.dcm',
			'wadouri:/dicom/1-018.dcm',
			'wadouri:/dicom/1-019.dcm',
			'wadouri:/dicom/1-020.dcm',
			'wadouri:/dicom/1-021.dcm',
			'wadouri:/dicom/1-022.dcm',
			'wadouri:/dicom/1-023.dcm',
			'wadouri:/dicom/1-024.dcm',
			'wadouri:/dicom/1-025.dcm',
			'wadouri:/dicom/1-026.dcm',
			'wadouri:/dicom/1-027.dcm',
			'wadouri:/dicom/1-028.dcm',
			'wadouri:/dicom/1-029.dcm',
			'wadouri:/dicom/1-030.dcm',
			'wadouri:/dicom/1-031.dcm',
			'wadouri:/dicom/1-032.dcm',
			'wadouri:/dicom/1-033.dcm',
			'wadouri:/dicom/1-034.dcm',
			'wadouri:/dicom/1-035.dcm',
			'wadouri:/dicom/1-036.dcm',
			'wadouri:/dicom/1-037.dcm',
			'wadouri:/dicom/1-038.dcm',
			'wadouri:/dicom/1-039.dcm',
			'wadouri:/dicom/1-040.dcm',
			'wadouri:/dicom/1-041.dcm',
			'wadouri:/dicom/1-042.dcm',
			'wadouri:/dicom/1-043.dcm',
			'wadouri:/dicom/1-044.dcm',
			'wadouri:/dicom/1-045.dcm',
			'wadouri:/dicom/1-046.dcm',
			'wadouri:/dicom/1-047.dcm',
			'wadouri:/dicom/1-048.dcm',
			'wadouri:/dicom/1-049.dcm',
			'wadouri:/dicom/1-050.dcm',
			'wadouri:/dicom/1-051.dcm',
			'wadouri:/dicom/1-052.dcm',
			'wadouri:/dicom/1-053.dcm',
			'wadouri:/dicom/1-054.dcm',
			'wadouri:/dicom/1-055.dcm',
			'wadouri:/dicom/1-056.dcm',
			'wadouri:/dicom/1-057.dcm',
			'wadouri:/dicom/1-058.dcm',
			'wadouri:/dicom/1-059.dcm',
			'wadouri:/dicom/1-060.dcm',
			'wadouri:/dicom/1-061.dcm',
			'wadouri:/dicom/1-062.dcm',
			'wadouri:/dicom/1-063.dcm',
			'wadouri:/dicom/1-064.dcm',
			'wadouri:/dicom/1-065.dcm',
			'wadouri:/dicom/1-066.dcm',
			'wadouri:/dicom/1-067.dcm',
			'wadouri:/dicom/1-068.dcm',
			'wadouri:/dicom/1-069.dcm',
			'wadouri:/dicom/1-070.dcm',
			'wadouri:/dicom/1-071.dcm',
			'wadouri:/dicom/1-072.dcm',
			'wadouri:/dicom/1-073.dcm',
			'wadouri:/dicom/1-074.dcm',
			'wadouri:/dicom/1-075.dcm',
			'wadouri:/dicom/1-076.dcm',
			'wadouri:/dicom/1-077.dcm',
			'wadouri:/dicom/1-078.dcm',
			'wadouri:/dicom/1-079.dcm',
			'wadouri:/dicom/1-080.dcm',
			'wadouri:/dicom/1-081.dcm',
			'wadouri:/dicom/1-082.dcm',
			'wadouri:/dicom/1-083.dcm',
			'wadouri:/dicom/1-084.dcm',
			'wadouri:/dicom/1-085.dcm',
			'wadouri:/dicom/1-086.dcm',
			'wadouri:/dicom/1-087.dcm',
			'wadouri:/dicom/1-088.dcm',
			'wadouri:/dicom/1-089.dcm',
			'wadouri:/dicom/1-090.dcm',
			'wadouri:/dicom/1-091.dcm',
			'wadouri:/dicom/1-092.dcm',
			'wadouri:/dicom/1-093.dcm',
			'wadouri:/dicom/1-094.dcm',
			'wadouri:/dicom/1-095.dcm',
			'wadouri:/dicom/1-096.dcm',
			'wadouri:/dicom/1-097.dcm',
			'wadouri:/dicom/1-098.dcm',
			'wadouri:/dicom/1-099.dcm',
			'wadouri:/dicom/1-100.dcm',
			'wadouri:/dicom/1-101.dcm',
			'wadouri:/dicom/1-102.dcm',
			'wadouri:/dicom/1-103.dcm',
			'wadouri:/dicom/1-104.dcm',
			'wadouri:/dicom/1-105.dcm',
			'wadouri:/dicom/1-106.dcm',
			'wadouri:/dicom/1-107.dcm',
			'wadouri:/dicom/1-108.dcm',
			'wadouri:/dicom/1-109.dcm',
			'wadouri:/dicom/1-110.dcm',
			'wadouri:/dicom/1-111.dcm',
			'wadouri:/dicom/1-112.dcm',
			'wadouri:/dicom/1-113.dcm',
			'wadouri:/dicom/1-114.dcm',
			'wadouri:/dicom/1-115.dcm',
		];
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
