import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.scss"
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FetchingBmccScho,ApplicantsRequest } from '../../api/request';
import { useState } from "react";
import { useEffect } from "react";
import { DataGrid} from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';


const CustomDataGrid = styled(DataGrid)({
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: 'white', 
    color: 'black', 
  },
});
const Home = () => {
  const [totalscho,setTotalscho] = useState([]);
  const [post , setPost] = useState([]);

  useEffect(() => {

    async function Fetch(){
      const scholars = await FetchingBmccScho.FETCH_SCHOLARS()
      console.log(scholars)
      setTotalscho(scholars.data.Scholars)
      const response = await ApplicantsRequest.ALL_APPLICANTS()
      const appdatali = response.data.results;
      console.log(appdatali)
      setPost(appdatali.reverse());
    }
    Fetch();
  }, []);
  const columns = [
    { field: 'applicantNum', headerName: 'Applicant ID', width: 100 },
    {
      field: 'SchoIarshipApplied',
      headerName: 'Scholarship Applied',
      width: 150,
      editable: true,
    },
    {
      field: 'Name',
      headerName: 'Name',
      width: 250,
      editable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      editable: false,
    },
    {
      field: 'score',
      headerName: 'Score',
      width: 110,
      editable: true,
    },
    {
      field: 'DateApplied',
      headerName: 'Date Applied',
      width: 190,
      editable: false,
    },

  ];
  const filteredRows = post.filter((row) => row.status === 'For Evaluation');
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
      <Navbar />
      <Box
      sx={{
        margin:'10px',
        display: 'flex',
        flexDirection:'row',
        justifyContent:'space-around',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: '30%',
          height: 158,
        },
      }}>

    <Card elevation={0} sx={{ minWidth: 275}}>
      <CardContent>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Total Scholars
        </Typography>
        <Typography variant="h5" component="div">
          {totalscho.length}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href="/scholars" sx={{color:'#666'}}>See More</Button>
      </CardActions>
    </Card>

    <Card elevation={0} sx={{ minWidth: 275}}>
      <CardContent>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Total Applicants
        </Typography>
        <Typography variant="h5" component="div">
          {filteredRows.length}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href="/applicants" sx={{color:'#666'}}>See More</Button>
      </CardActions>
    </Card>

    <Card elevation={0} sx={{ minWidth: 275}}>
      <CardContent>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
          Appointed Today
        </Typography>
        <Typography variant="h5" component="div">
          0
        </Typography>
      </CardContent>
      <CardActions>
        <Button href="/appointments" size="small" sx={{color:'#666'}}>See More</Button>
      </CardActions>
    </Card>

    </Box>

      <div className="listContainer">
      <Box 
            sx={{
              margin:'15px',
              color:'#666',
              fontFamily:'font-family: "Open Sans",sans-serif;'
            }}>
      <h1>Recent Applicants</h1>
      <CustomDataGrid className="dataGrid"
        rows={post}
        columns={columns}
        getRowId={(row) => row.applicantNum}
        scrollbarSize={10}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[25]}  
        disableRowSelectionOnClick
      />
      </Box>
      </div>
      </div>
      </div>
  )
}
export default Home