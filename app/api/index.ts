const hostUrl = 'http://35.194.13.183:3389'
// const hostUrl = 'explore'

const getAgentList = async () => {
    try {
        const response = await fetch(`${hostUrl}/verifiable/agents`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching agent list:', error);
        throw error;
    }
}

const getAgentLogs = async (query: string, page: number = 1, pageSize: number = 35) => {
	try {
		
		const response = await fetch(`${hostUrl}/verifiable/logs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: {
					contLike: query.slice(0, 30)
				},
				page,
				pageSize
			})
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching agent logs:', error);
		throw error;
	}
}
const getAgentAttestation = async (agentId: string, publicKey: string) => {
    try {
        const response = await fetch(`${hostUrl}/verifiable/attestation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agentId,
                publicKey
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching agent attestation:', error);
        throw error;
    }
}


export { getAgentList, getAgentLogs, getAgentAttestation };

