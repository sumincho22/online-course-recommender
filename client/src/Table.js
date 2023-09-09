function Table({stats}) {
    console.log(stats[0]);
  return (
  <>
  <div className="Results">
  
  <table class="table table-striped">
    <thread>
        <th scope="col">Name</th>
        <th scope="col">Beginner</th>
        <th scope="col">Intermediate</th>
        <th scope="col">Advanced</th>
        <th scope="col">Credibility</th>
    </thread>
    <tbody>
        {stats[0].map((Uni) => {
            return (
            <>
            <tr>
                <td>{Uni.institution}</td>
                <td>{Uni.num_beginner}</td>
                <td>{Uni.num_intermediate}</td>
                <td>{Uni.num_advanced}</td>
                <td>{Uni.credibility}</td>
            </tr> 
            </>
            )
        })}
    </tbody>
  </table>
  </div>
  </>
  )
}

export default Table;