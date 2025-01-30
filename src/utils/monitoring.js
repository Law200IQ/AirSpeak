class MonitoringManager {
  constructor() {
    if (MonitoringManager.instance) {
      return MonitoringManager.instance;
    }
    MonitoringManager.instance = this;
    
    this.metrics = {
      errors: [],
      performance: [],
      webrtc: [],
      network: []
    };

    this.listeners = new Set();
    this.startTime = Date.now();
  }

  // Performance monitoring
  measurePerformance(metric) {
    const entry = {
      ...metric,
      timestamp: Date.now(),
      timeSinceStart: Date.now() - this.startTime
    };

    this.metrics.performance.push(entry);
    this.notifyListeners('performance', entry);
    this.sendToAnalytics('performance', entry);
  }

  // WebRTC statistics
  recordWebRTCStats(stats) {
    const entry = {
      ...stats,
      timestamp: Date.now()
    };

    this.metrics.webrtc.push(entry);
    this.notifyListeners('webrtc', entry);
    this.sendToAnalytics('webrtc', entry);

    // Analyze for potential issues
    this.analyzeWebRTCStats(stats);
  }

  analyzeWebRTCStats(stats) {
    // Check for poor connection quality
    if (stats.packetsLost > 50 || stats.jitter > 100) {
      this.recordError('poor_connection', {
        packetsLost: stats.packetsLost,
        jitter: stats.jitter
      });
    }

    // Check for audio issues
    if (stats.audioLevel < 0.1 && !stats.muted) {
      this.recordError('low_audio', {
        level: stats.audioLevel
      });
    }
  }

  // Network monitoring
  recordNetworkStats(stats) {
    const entry = {
      ...stats,
      timestamp: Date.now()
    };

    this.metrics.network.push(entry);
    this.notifyListeners('network', entry);
    this.sendToAnalytics('network', entry);
  }

  // Error tracking
  recordError(type, details = {}) {
    const error = {
      type,
      details,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.metrics.errors.push(error);
    this.notifyListeners('error', error);
    this.sendToAnalytics('error', error);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error recorded:', error);
    }
  }

  // Analytics
  sendToAnalytics(type, data) {
    // In a production environment, you would send this to your analytics service
    // For now, we'll just store it locally
    try {
      const analyticsData = {
        type,
        data,
        timestamp: Date.now(),
        sessionId: this.getSessionId()
      };

      // Store in localStorage for development
      const analytics = JSON.parse(localStorage.getItem('airspeak_analytics') || '[]');
      analytics.push(analyticsData);
      localStorage.setItem('airspeak_analytics', JSON.stringify(analytics));

    } catch (err) {
      console.error('Failed to send analytics:', err);
    }
  }

  // Session management
  getSessionId() {
    let sessionId = sessionStorage.getItem('airspeak_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('airspeak_session_id', sessionId);
    }
    return sessionId;
  }

  // Listener management
  addListener(listener) {
    this.listeners.add(listener);
  }

  removeListener(listener) {
    this.listeners.delete(listener);
  }

  notifyListeners(type, data) {
    this.listeners.forEach(listener => {
      try {
        listener(type, data);
      } catch (err) {
        console.error('Error in monitoring listener:', err);
      }
    });
  }

  // Metrics retrieval
  getMetrics(type) {
    return this.metrics[type] || [];
  }

  getLatestMetric(type) {
    const metrics = this.getMetrics(type);
    return metrics[metrics.length - 1];
  }

  // Performance metrics
  measurePageLoad() {
    if (window.performance) {
      const timing = window.performance.timing;
      const pageLoad = timing.loadEventEnd - timing.navigationStart;
      this.measurePerformance({
        type: 'page_load',
        duration: pageLoad
      });
    }
  }

  measureApiCall(endpoint, duration, success) {
    this.measurePerformance({
      type: 'api_call',
      endpoint,
      duration,
      success
    });
  }

  // Resource monitoring
  checkResources() {
    if (window.performance && window.performance.memory) {
      const memory = window.performance.memory;
      this.measurePerformance({
        type: 'memory',
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize
      });
    }
  }

  // Start monitoring
  startMonitoring() {
    // Monitor page load
    window.addEventListener('load', () => this.measurePageLoad());

    // Monitor resources periodically
    setInterval(() => this.checkResources(), 30000);

    // Monitor network status
    window.addEventListener('online', () => {
      this.recordNetworkStats({ status: 'online' });
    });

    window.addEventListener('offline', () => {
      this.recordNetworkStats({ status: 'offline' });
    });

    // Initial network status
    this.recordNetworkStats({
      status: navigator.onLine ? 'online' : 'offline'
    });
  }
}

const monitoringManager = new MonitoringManager();
export default monitoringManager;
