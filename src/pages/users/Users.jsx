import { UsersRequest,setRemarks } from '../../api/request';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import './users.scss';
import { useEffect, useState } from 'react';
import { Box,Card } from "@mui/material"; 
import { styled } from '@mui/material/styles';
import { DataGrid} from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import './user.css'
import { GridColDef } from '@mui/x-data-grid';

const Users = () => {
  
  const [display, setDisplay] = useState([]);

  const handleButtonClick = async (id) => {
    const updatedDisplay = display.map(row => {
      if (row.applicantNum === id) {
        let newRemarks;
        if (row.remarks === 'Active') {
          newRemarks = 'Inactive';
        } else if (row.remarks === 'Inactive') {
          newRemarks = 'Deactivated';
        } else {
          newRemarks = 'Active';
        }
        return { ...row, remarks: newRemarks };
      }
      return row;
    });
  
    setDisplay(updatedDisplay);

    try {
      const remarksstat = updatedDisplay.find(row => row.applicantNum === id)?.remarks;
      const applicantNum = updatedDisplay.find(row => row.applicantNum === id)?.applicantNum;
      console.log(remarksstat,applicantNum)
      const formData = new FormData();
      formData.append('remarks',remarksstat);
      formData.append('applicantNum',applicantNum)
     const response = await setRemarks.SET_REMARKS(formData);
      console.log(response);
    } catch (error) {
      console.log('Error updating status:', error);
      // Rollback the display state to its previous value on error
      setDisplay(prevDisplay => prevDisplay.map(row => (row.applicantNum === id ? { ...row } : row)));
    }
  };
  
  
  const columns = [
    { 
      field: 'applicantNum',
      headerName: 'Applicant ID',
      width: 90, 
      editable: false,
    
    },

    {
      field: 'ScholarshipApplied',
      headerName: 'Scholarship Applied',
      width: 200,
      editable: false,

    },
    
    {
      field: 'profile',
      headerName: 'Profile',
      width: 120,
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
        );},},

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
      headerName: 'Remarks',
      width: 150,
      editable: false,
    
    },

    {
      field: 'remarks',
      headerName: 'Account Status',
      width: 150,
      headerAlign: 'center',
      renderCell: (params) => {
        let color1 = 'green'
        if(params.value === "Inactive"){
          color1 = 'yellow'
        }
        if(params.value === 'Deactivated'){
          color1 ='red'
        }
        return(
        <>
        <button  className="myButton1">
          {params.row.remarks === 'Active'
            ? 'Active'
            : params.row.remarks === 'Inactive'
            ? 'Inactive'
            : 'Deactivated'}
        </button>
        </>)
      },
    },
  ];

  const CustomDataGrid = styled(DataGrid)({
    '& .MuiDataGrid-columnHeaders': {
      color: 'black',
      
    },
  });
  
  useEffect(() => {
    async function Fetch(){
      const userinfo = await UsersRequest.ALL_USERS()
      setDisplay(userinfo.data.UserAccounts);
    }
    Fetch();
   
  }, []);
  return (
    <>
    <div className="users">
      <Sidebar />
      <div className="usersContainer">
        <Navbar />

      
        <div className='userlistcon'>
          <h1> Users Account List </h1>

      <Box>
        <Card>
        <CustomDataGrid
              className='dataGrid'
              rows={display}
              columns={columns}
              getRowId={(row) => row.applicantNum}
              scrollbarSize={10}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },},}}

              checkboxSelection   
              disableRowSelectionOnClick
              pageSizeOptions={[25]}
            />
            </Card>
          </Box>
        </div>
      
      </div>
    </div>
    </>
  )
}


export default Users