import { useEffect, useState } from 'react';
import { createClient } from 'urql';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [stakingPools, setStakingPools] = useState([]);
  const [error, setError] = useState(null);

  const QueryURL= "https://gateway-arbitrum.network.thegraph.com/api/5260322b071d6d4ab1dae66256ab9f3b/subgraphs/id/FwsBnbhUZ58CpN3C1qSKKACvwBUoAD3xgBVFRLribNxK";

  const client = createClient({
    url: QueryURL
  });

  const query = `{
    users(first: 5) {
      id
      stakingPools {
        id
      }
      bsptPools {
        id
      }
      marketplacePools {
        id
      }
    }
    stakingPools(first: 5) {
      id
      poolAmounts {
        id
      }
      poolUsers {
        id
      }
      stats {
        id
      }
    }
  }`;

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await client.query(query).toPromise();
        console.log(data);
        if (data) {
          if (data.users) {
            setUsers(data.users);
          } else {
            setError('Error: Users data not as expected.');
          }

          if (data.stakingPools) {
            setStakingPools(data.stakingPools);
          } else {
            setError('Error: Staking Pools data not as expected.');
          }
        } else {
          setError('Error: Data not as expected.');
        }
      } catch (error) {
        console.error(error);
        setError('Error fetching data.');
      }
    };
    getData();
  }, [client, query]);

  return (
    <>
      <div>
        <h1>GraphQL Data Information</h1>
        {error && <p>{error}</p>}
        <div>
          <h2>Users</h2>
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.id}>
                <div><b>User ID: </b>{user.id}</div>
                <div><b>Staking Pools: </b>{user.stakingPools.map(pool => pool.id).join(', ')}</div>
                <div><b>Bspt Pools: </b>{user.bsptPools.map(pool => pool.id).join(', ')}</div>
                <div><b>Marketplace Pools: </b>{user.marketplacePools.map(pool => pool.id).join(', ')}</div>
                <br></br>
              </div>
            ))
          ) : (
            <p>No users available.</p>
          )}
        </div>
        <div>
          <h2>Staking Pools</h2>
          {stakingPools.length > 0 ? (
            stakingPools.map((pool) => (
              <div key={pool.id}>
                <div><b>Pool ID: </b>{pool.id}</div>
                <div><b>Pool Amounts: </b>{pool.poolAmounts.map(amount => amount.id).join(', ')}</div>
                <div><b>Pool Users: </b>{pool.poolUsers.map(user => user.id).join(', ')}</div>
                <div><b>Stats: </b>{pool.stats.id}</div>
                <br></br>
              </div>
            ))
          ) : (
            <p>No staking pools available.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
