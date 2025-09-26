// import ivm from "isolated-vm"; this will actually take too much CPU/memory from me rn, so later

// my AI anomaly detection will be here as well as my Synthik integration
class AnalysisService {
  static async detectAnomalies(dataset) {
    // simple  anomaly detection
    const anomalies = dataset.filter((record) => {
      const voteCount = parseInt(record.votes, 10);
      return voteCount < 0 || voteCount > 10000; // Simple rule because I'm only building for demo rn
    });

    // Integrating with Synthik API for synthetic data (dummy rn)
    try {
      const response = await fetch("https://api.synthik.com/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SYNTHIK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ schema: dataset[0], count: 10 }),
      });

      if (response.ok) {
        const syntheticData = await response.json();

        // Simple synthetic vs real comparison
        const additionalAnomalies = dataset.filter((record, i) => {
          const synthetic = syntheticData[i % syntheticData.length];
          return Math.abs(record.votes - synthetic.votes) > 5000;
        });

        anomalies.push(...additionalAnomalies);
      }
    } catch (error) {
      console.error("Synthik API error:", error.message);
    }

    return anomalies;
  }
}

export default AnalysisService;
