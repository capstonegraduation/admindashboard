import { UsersRequest,setRemarks } from '../../api/request';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import './users.scss';
import { useEffect, useState } from 'react';
import { Box,Card } from "@mui/material"; 
import { styled } from '@mui/material/styles';
import { DataGrid} from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import { CircularProgress, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import './user.css'

const Users = () => {
  
  const [display, setDisplay] = useState([]);  
  const columns = [

    {
      field: 'ScholarshipApplied',
      headerName: 'Scholarship Applied',
      width: 100,
      editable: false,

    },
    
    {
      field: 'profile',
      headerName: 'Profile',
      width: 150,
      renderCell: (params) => {
        console.log(params)
        const isOnline = params.row.isOnline; 
        let chipColor = 'error'; 
        let status = 'Offline';
        if (isOnline === 'True') {
          chipColor = 'success'; 
          status = 'Online'
        }
        
        return (
          <Chip 
            color={chipColor}
            label={status}
            avatar={
              <Avatar
                alt="No Image"
                src={params.value}
                sx={{ width: 35, height: 35 }}
              />}/>
        );},
      },

    {
      field: 'userType',
      headerName: 'Type',
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
      width: 100,
      editable: false,
    
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      width: 100,
      editable: false,
    
    },
    {
      field: 'device',
      headerName: 'Device used',
      width: 100,
      editable: false,
    
    },
  ];

  const CustomDataGrid = styled(DataGrid)({
    '& .MuiDataGrid-columnHeaders': {
      color: 'black',
      width:'100%'
    },
  });
  
  useEffect(() => {
    async function Fetch(){
      const userinfo = await UsersRequest.ALL_USERS()
      setDisplay(userinfo.data.UserAccounts);
      
    }
    Fetch();
    const intervalId = setInterval(() => {
      Fetch();
    }, 5000); 
    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
    <div className="users">
      <Sidebar />
      <div className="usersContainer">
        <Navbar />
        <div className='userlistcon'>
          <p className="scorecardh"> Users Account List </p>
      <Box>
        <Card sx={{width:'100%'}}>
        {display.length === 0 ? (
        <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <CircularProgress />
        </div>
        <div>
          <p>Loading...</p>
          <div className="loading-animation"></div>
        </div>
      </div>) : (<CustomDataGrid
              rows={display}
              columns={columns}
              getRowId={(row) => row.applicantNum}
              scrollbarSize={10}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },},}}
              pageSizeOptions={[20,30]}
            />)}
            </Card>
          </Box>
        </div>
      
      </div>
    </div>
    </>
  )
}


export default Users