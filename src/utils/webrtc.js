import Peer from 'simple-peer';
import monitoringManager from './monitoring';

class WebRTCManager {
  constructor() {
    if (WebRTCManager.instance) {
      return WebRTCManager.instance;
    }
    WebRTCManager.instance = this;
    
    this.peer = null;
    this.stream = null;
    this.handlers = {};
    this.statsInterval = null;
    this.audioContext = null;
    this.audioAnalyser = null;
  }

  setHandlers(handlers) {
    this.handlers = handlers;
  }

  async getMediaStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.stream = stream;
      this.setupAudioAnalyser();
      return stream;
    } catch (err) {
      console.error('Error accessing microphone:', err);
      monitoringManager.recordError('media_access', {
        error: err.message
      });
      throw err;
    }
  }

  setupAudioAnalyser() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.audioAnalyser = this.audioContext.createAnalyser();
      source.connect(this.audioAnalyser);
    } catch (err) {
      console.error('Error setting up audio analyser:', err);
      monitoringManager.recordError('audio_analyser', {
        error: err.message
      });
    }
  }

  getAudioLevel() {
    if (!this.audioAnalyser) return 0;

    const dataArray = new Uint8Array(this.audioAnalyser.frequencyBinCount);
    this.audioAnalyser.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    return average / 255; // Normalize to 0-1
  }

  createPeer(initiator = false) {
    if (!this.stream) {
      throw new Error('No media stream available');
    }

    const config = {
      initiator,
      stream: this.stream,
      trickle: false,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          {
            urls: 'turn:numb.viagenie.ca',
            username: 'webrtc@live.com',
            credential: 'muazkh'
          }
        ]
      }
    };

    this.peer = new Peer(config);

    this.peer.on('signal', data => {
      this.handlers.onSignal?.(data);
    });

    this.peer.on('connect', () => {
      this.startStatsMonitoring();
      this.handlers.onConnect?.();
    });

    this.peer.on('stream', stream => {
      this.handlers.onStream?.(stream);
    });

    this.peer.on('error', err => {
      monitoringManager.recordError('peer_error', {
        error: err.message
      });
      this.handlers.onError?.(err);
    });

    this.peer.on('close', () => {
      this.stopStatsMonitoring();
      this.handlers.onClose?.();
    });

    return this.peer;
  }

  startStatsMonitoring() {
    if (!this.peer || this.statsInterval) return;

    this.statsInterval = setInterval(async () => {
      try {
        const stats = await this.peer._pc.getStats();
        const statsObj = {};

        stats.forEach(report => {
          if (report.type === 'inbound-rtp' && report.kind === 'audio') {
            statsObj.packetsLost = report.packetsLost;
            statsObj.packetsReceived = report.packetsReceived;
            statsObj.jitter = report.jitter;
            statsObj.bytesReceived = report.bytesReceived;
          }
        });

        statsObj.audioLevel = this.getAudioLevel();
        statsObj.connectionState = this.peer._pc.connectionState;
        statsObj.iceConnectionState = this.peer._pc.iceConnectionState;

        monitoringManager.recordWebRTCStats(statsObj);
      } catch (err) {
        console.error('Error getting WebRTC stats:', err);
      }
    }, 1000);
  }

  stopStatsMonitoring() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
  }

  signal(data) {
    if (!this.peer) {
      throw new Error('No peer connection');
    }
    this.peer.signal(data);
  }

  mute() {
    if (this.stream) {
      this.stream.getAudioTracks().forEach(track => {
        track.enabled = false;
      });
    }
  }

  unmute() {
    if (this.stream) {
      this.stream.getAudioTracks().forEach(track => {
        track.enabled = true;
      });
    }
  }

  destroy() {
    this.stopStatsMonitoring();
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.audioAnalyser = null;
    }

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }
}

const webRTCManager = new WebRTCManager();
export default webRTCManager;
