const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const driver = neo4j.driver(
"bolt://127.0.0.1:7687",
  neo4j.auth.basic('neo4j', '1234567890') // replace with your actual password
);

// driver.verifyConnectivity()
//   .then(() => console.log('✅ Connected to Neo4j'))
//   .catch(error => console.error('❌ Neo4j connection error:', error));

driver.verifyConnectivity()
  .then(() => driver.getServerInfo())
  .then(info => console.log('✅ Connected to Neo4j:', info))
  .catch(error => console.error('❌ Neo4j connection error:', error));

const session = driver.session();

app.post('/query', async (req, res) => {
  const { paperA, paperB, queryType, customQuery } = req.body;
  let cypher = '';
  let params = {};

  try {
    if (queryType === 'citation') {
      cypher = `
        MATCH path = (a:Paper {id: $paperA})-[:CITES*1..5]->(b:Paper {id: $paperB})
        RETURN path LIMIT 1
      `;
      params = { paperA, paperB };
    } else if (queryType === 'classification') {
      cypher = `
        MATCH (p:Paper {id: $paperA})-[:HAS_CLASSIFICATION]->(c:Classification)-[:SUBCLASS_OF*0..]->(parent)
        RETURN p.id, p.class, c.name AS classification, collect(parent.name) AS fullHierarchy
      `;
      params = { paperA };
    } else if (queryType === 'custom') {
      cypher = customQuery;
    }

    const result = await session.run(cypher, params);
    res.json(result.records.map(record => record.toObject()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
