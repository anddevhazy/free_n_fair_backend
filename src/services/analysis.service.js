import SynthikClient, { ColumnBuilder } from "synthik-client";
// import ivm from "isolated-vm"; this will actually take too much CPU/memory from me rn, so later

// my AI anomaly detection will be here as well as my Synthik integration
class AnalysisService {
  static async detectAnomalies(dataset) {
    // I'm implementing  anomaly detection in a very simple, rule-based way.
    const anomalies = dataset.filter((record) => {
      const voteCount = parseInt(record.votes, 10);
      return voteCount < 0 || voteCount > 10000;
    });

    try {
      const client = new SynthikClient();

      //Need to build a schema from the dataset[0] ( this is my basic demo version)
      const req = {
        num_rows: 10,
        topic: "Election voting records",
        columns: [
          ColumnBuilder.int("votes", {
            description: "Vote count per candidate",
            constraints: { min: 0, max: 20000 },
          }).build(),
          ColumnBuilder.string("candidate", {
            description: "Candidate name",
          }).build(),
          ColumnBuilder.string("district", {
            description: "District identifier",
          }).build(),
        ],
      };

      const syntheticData = await client.tabular.generate(req, {
        strategy: "adaptive_flow",
        format: "json",
      });

      // Compare dataset with syntheticData
      syntheticData.forEach((synthetic, i) => {
        const record = dataset[i % dataset.length];
        if (Math.abs(record.votes - synthetic.votes) > 5000) {
          anomalies.push(record);
        }
      });
    } catch (error) {
      console.error("Synthik SDK error:", error.message);
    }

    return anomalies;
  }
}

export default AnalysisService;
