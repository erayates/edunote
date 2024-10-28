exports = async function(changeEvent) {
    const doc = changeEvent.fullDocument;
    const url = 'https://your-api-url.com/get-embedding';
    
    try {
        console.log(`Processing document with id: ${doc._id}`);
        
        let response = await context.http.post({
            url: url,
            headers: {
                'Content-Type': ['application/json']
            },
            body: JSON.stringify({
                query: doc.content,
            })
        });

        let responseData = EJSON.parse(response.body.text());
        
        if(response.statusCode === 200) {
            console.log("Successfully received embedding.");
            const embedding = responseData.embedding;
            
            const collection = context.services.get("BTK-Cluster").db("edunote").collection("notes");
            
            const result = await collection.updateOne(
                { _id: doc._id },
                { $set: { embedding: embedding }}
            );
            
            if(result.modifiedCount === 1) {
                console.log("Successfully updated the document.");
            } else {
                console.log("Failed to update the document.");
            }
        } else {
            console.log(`Failed to receive embedding. Status code: ${response.statusCode}`);
        }
    } catch(err) {
        console.error(err);
    }
};
