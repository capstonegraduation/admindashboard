import React, { useEffect, useState } from 'react'
import './evaluation.css'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import { DataGrid,} from '@mui/x-data-grid';
import { Tabs, Tab, Box, Modal,Card,Button } from "@mui/material";  
import { ApplicantsRequest, FetchingApplicantsInfo, ListofSub,
    CheckingSubs, CheckingApplicants,UserScore,SetApplicant,FailedUser,FetchingBmccSchoinfo,
      UpdatePassSlots,FetchPassSlots,DecrePassSlots,GrantAccess } from "../../api/request";
import TextField from '@mui/material/TextField';
import swal from 'sweetalert';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import { useContext } from "react";
import { admininfo } from "../../App";
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import { styled, ThemeProvider, createTheme } from '@mui/material';
import { Backdrop, CircularProgress } from '@mui/material';

const theme = createTheme();
const StyledBackdrop = styled(Backdrop)`
  z-index: ${({ theme }) => theme.zIndex.drawer + 1};
`;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Evaluation = () => {
  const { loginUser,user } = useContext(admininfo);
  const [showBackdrop, setShowBackdrop] = useState(false);
    const [data, setData] = useState([]);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('')
    const [userscore,setUserScore] = useState([]);
    const [selectedInfo, setSelectedInfo] = useState({});
    const [applicantsInfo, setApplicantInfo] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [passSlot,setPassSlot] = useState([]);
    const [passscore, setPassscore] = useState('');
    const [slots, setSlots] = useState('');
    const [isButtonVisible, setIsButtonVisible] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const handleCloseDialog = () => setOpenDialog(false);
    const [activeState,setActiveState] = useState('All');
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [failedSelectionModel,setFailedSelectionModel] = useState([]);
    const [who,setWho] = useState('');
    const [isSend,setIsSend] = useState('No')
    const [checked, setChecked] = React.useState(false);

    const handleChangeCheckbox = (event) => {
      const check = event.target.checked
      if(check){
        setChecked(check);
        setIsSend('Yes')
      }else{
        setChecked(check);
        setIsSend('No')
      }

    };
    const handleOpenDialog = (data) => {
      setOpenDialog(true);
      setWho(data.applicantNum)
    }
    useEffect(() => {

        async function Fetch(){
          setShowBackdrop(true);
          const response = await ApplicantsRequest.ALL_APPLICANTS();
          const pass = await FetchPassSlots.FETCH_PASSSLOTS()
          const ForEva = response.data.results?.filter(user => user.status === 'For Evaluation')
          setData(ForEva);
          setPassSlot(pass.data.result[0])
          setShowBackdrop(false);
        }
        Fetch();
      }, []);
      useEffect(() => {
        setIsButtonVisible(passscore !== '' || slots !== '');
      }, [passscore,slots]);
    
      const view = async (data) => {
        const applicantNum = data.applicantNum;
        const formData = new FormData();
        formData.append('applicantNum',applicantNum)
        try {
          setShowBackdrop(true);
          const response = await Promise.all([
            FetchingApplicantsInfo.FETCH_INFO(applicantNum),
            ListofSub.FETCH_SUB(applicantNum),
            UserScore.USER_SCORE(applicantNum)
          ]);
          console.log(response[2].data.result[0])
          setApplicantInfo(response[0].data.results[0]);
          setUserScore(response[2].data.result[0])
          setShowBackdrop(false);
          handleOpen()
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    
      }
      const failed = async(data) =>{
        const res = await FetchingBmccSchoinfo.FETCH_SCHOLARSINFO(data.applicantNum);
        const schoapplied = res.data.ScholarInf.results1[0].SchoIarshipApplied;
        const batch = res.data.ScholarInf.results1[0].Batch;
        const reason = 'Score did not Meet Passing Score'
        const formData = new FormData();
        formData.append('applicantNum',data.applicantNum)
        formData.append('Name',data.Name)
        formData.append('ScholarshipApplied', schoapplied)
        formData.append('batch',batch)
        formData.append('Reason',reason)
        formData.append('email',res.data.ScholarInf.results1[0].email)
        setShowBackdrop(true);
        const response = await FailedUser.FAILED_USER(formData)
        if(response.data.success === 1){
          setShowBackdrop(false);
          swal({
            title: "Success",
            text: "Succes!",
            icon: "success",
            button: "OK",
          });
        }else{
          setShowBackdrop(false);
          swal({
            title: "Failed",
            text: "Something Went Wrong!",
            icon: "error",
            button: "OK",
          });
        }
      }
      const handleRowSelectionModelChange = (newRowSelectionModel) => {
        console.log(newRowSelectionModel)
        setRowSelectionModel(newRowSelectionModel);

      };
      const handleFailedSelectionModelChange = (newFailedSelectionModel) => {
        console.log(newFailedSelectionModel)
        setFailedSelectionModel(newFailedSelectionModel);

      };
    const columns = [
        { 
          field: 'applicantNum', 
          headerName: 'Registry ID',
          width: 100
         },
         {
           field: 'applicantCode', 
            headerName: 'Applicant Code',
          width: 150
          },
        {
          field: 'SchoIarshipApplied',
          headerName: 'Scholarship Applied',
          width: 150,
          editable: false,
        },
        {
          field: 'Name',
          headerName: 'Name',
          width: 150,
          editable: false,
        },
        {
          field: 'DateApplied',
          headerName: 'Date Applied',
          width: 150,
          editable: false,
        },
        {
          field: 'status',
          headerName: 'Status',
          width: 100,
          editable: false,
        },
        {
          field: 'stat',
          headerName: 'Score',
          width: 70,
          editable: false,
          renderCell: (params) =>(
            <>
            <p>{params.row.score}</p>
            </>
          ),
        },
        {
            field: 'insert',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <>
                <div style={{display:'flex',flexDirection:'column',height:'100%',width:'100%',justifyContent:'center',alignItems:'center'}}>
                <button className='myButton'
                onClick={() => view(params.row)}>View Details</button>
                </div>
              </>
            ),
          },
          {
            field: 'score',
            headerName: 'Details',
            width: 250,
            renderCell: (params) => {
              let status
              if(params.value >= passSlot.passingscore){
                status = 'Passed'
              }
              if(params.value < passSlot.passingscore){
                status = 'Failed'
              }
              return(
                <>
                <div style={{width:"100%",display:'flex',height:'100%',justifyContent:'center',alignItems:'center'}}>
              {status === 'Passed' && <button className='myButton1' 
              onClick={() => setFirsttoSecStat(params.row)}>
                Add to Applicants List
                </button>}
              {status === 'Failed' && (<>
                {params.row.grantedAccess === '' || !params.row.grantedAccess ? (<button className='myButton'  
              onClick={() =>handleOpenDialog(params.row)}>
                Access</button>) : (<button className='myButton1' 
              onClick={() => setFirsttoSecStat(params.row)}>
                Add to Applicants List
                </button>)}
                <button style={{marginLeft:'10px'}} className='myButton2' 
              onClick={() => failed(params.row)}>
                Failed
                </button>
                </>)}
              </div>
              </>)
            },
          },
    
      ];
    const passedColumn = [
        { 
          field: 'applicantNum', 
          headerName: 'Registry ID',
          width: 100
         },
         {
           field: 'applicantCode', 
            headerName: 'Applicant Code',
          width: 150
          },
        {
          field: 'SchoIarshipApplied',
          headerName: 'Scholarship Applied',
          width: 150,
          editable: false,
        },
        {
          field: 'Name',
          headerName: 'Name',
          width: 150,
          editable: false,
        },
        {
          field: 'DateApplied',
          headerName: 'Date Applied',
          width: 150,
          editable: false,
        },
        {
          field: 'status',
          headerName: 'Status',
          width: 100,
          editable: false,
        },
        {
          field: 'stat',
          headerName: 'Score',
          width: 70,
          editable: false,
          renderCell: (params) =>(
            <>
            <p>{params.row.score}</p>
            </>
          ),
        },
        {
            field: 'insert',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <>
                <div style={{display:'flex',flexDirection:'column',height:'100%',width:'100%',justifyContent:'center',alignItems:'center'}}>
                <button className='myButton'
                onClick={() => view(params.row)}>View Details</button>
                </div>
              </>
            ),
          },
          {
            field: 'score',
            headerName: 'Details',
            width: 250,
            renderCell: (params) => {
              return(
                <>
                <div style={{width:"100%",display:'flex',flexDirection:'column',height:'100%',justifyContent:'center',alignItems:'center'}}>
              <button className='myButton1' 
              onClick={() => setFirsttoSecStat(params.row)}>
                Add to Applicants List
                </button>
              </div>
              </>)
            },
          },
    
      ];
    const failedColumn = [
        { 
          field: 'applicantNum', 
          headerName: 'Registry ID',
          width: 100
         },
         {
           field: 'applicantCode', 
            headerName: 'Applicant Code',
          width: 150
          },
        {
          field: 'SchoIarshipApplied',
          headerName: 'Scholarship Applied',
          width: 150,
          editable: false,
        },
        {
          field: 'Name',
          headerName: 'Name',
          width: 150,
          editable: false,
        },
        {
          field: 'DateApplied',
          headerName: 'Date Applied',
          width: 150,
          editable: false,
        },
        {
          field: 'status',
          headerName: 'Status',
          width: 100,
          editable: false,
        },
        {
          field: 'stat',
          headerName: 'Score',
          width: 70,
          editable: false,
          renderCell: (params) =>(
            <>
            <p>{params.row.score}</p>
            </>
          ),
        },
        {
            field: 'insert',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <>
                <div style={{display:'flex',flexDirection:'column',height:'100%',width:'100%',justifyContent:'center',alignItems:'center'}}>
                <button className='myButton'
                onClick={() => view(params.row)}>View Details</button>
                </div>
              </>
            ),
          },
          {
            field: 'grantedAccess',
            headerName: 'Details',
            width: 350,
            renderCell: (params) => {
              console.log(params.row)
              return(
                <>
                <div style={{width:"100%",display:'flex',height:'100%',justifyContent:'center',alignItems:'center'}}>
              {params.row.grantedAccess === '' || !params.row.grantedAccess ? (<button className='myButton'
              onClick={() =>handleOpenDialog(params.row)}>
                Access</button>) : (<button className='myButton1' 
              onClick={() => setFirsttoSecStat(params.row)}>
                Add to Applicants List
                </button>)}
                <button className='myButton2' style={{marginLeft:'5px'}}
              onClick={() => failed(params.row)}>
                Failed
                </button>
              </div>
              </>)
            },
          },
    
      ];
      const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
      };

    const TabPanel = ({ children, value, index }) => (
            <div role="tabpanel" hidden={value !== index}>
              {value === index && <Box p={3}>{children}</Box>}
            </div>
          );

    const setFirsttoSecStat = async(data) =>{
        console.log(data)
        if (passSlot.slots === 0) {
          swal({
            text: 'No Slots Available',
            timer: 2000,
            buttons: false,
            icon: 'error',
          });
          return;
        }
        const decre = await DecrePassSlots.DECRE_PASSSLOTS();
        const formData = new FormData();
        formData.append('email',data.email);
        formData.append('applicantNum',data.applicantNum)
        setShowBackdrop(true);
        SetApplicant.SET_APPLICANT(formData)
        .then(res => {
          if(res.data.success === 1){
            console.log(res)
            setPassSlot(decre.data.results[0]);
            setData(res.data.result);
            setPassscore(decre.data.results[0].passingscore);
            setSlots(decre.data.results[0].slots);
            setShowBackdrop(false);
            swal({
              text: 'Status Updated',
              timer: 2000,
              buttons: false,
              icon: "success",
            })
          }else{
            setShowBackdrop(false);
            swal({
              text: 'Something Went Wrong',
              timer: 2000,
              buttons: false,
              icon: "error",
            })
          }

          }
           )
          .catch(err => console.log(err));
    }
    const ScoreSlot = () =>{
      if(user.name !== 'Admin'){
        swal({
          text: 'UnAuthorized Access',
          timer: 2000,
          buttons: false,
          icon: "error",
        })
        setPassscore(passSlot.passingscore)
        setSlots(passSlot.slots)
        return
      }
      const data1 = passscore || passSlot.passingscore;
      const data2 = slots || passSlot.slots
      const formData = new FormData();
      formData.append('passscore',data1);
      formData.append('slots',data2);
      setShowBackdrop(true);
      UpdatePassSlots.UPDATE_PASSSLOTS(formData)
      .then(res => {
        if(res.data.success === 1){
          setPassSlot(res.data.results[0])
          setShowBackdrop(false);
          swal({
            title: "Success",
            text: "Updated!",
            icon: "success",
            button: "OK",
          });
        }else{
          setShowBackdrop(false);
          swal({
            title: "Failed",
            text: "Something Went Wrong!",
            icon: "error",
            button: "OK",
          });
        }

        }
         )
        .catch(err => console.log(err));
    }
    const Addall = async () => {
      const selectedRows = rowSelectionModel.map((selectedRow) =>
        data.find((row) => row.applicantNum === selectedRow)
      );
    
      if (passSlot.slots === 0) {
   
        swal({
          text: 'No Slots Available',
          timer: 2000,
          buttons: false,
          icon: 'error',
        });
        return;
      }else if(passSlot.slots < selectedRows.length){
        swal({
          text: 'Insufficient slots for Selected User',
          timer: 2000,
          buttons: false,
          icon: 'error',
        });
        return;
      }
    
      const decre = await DecrePassSlots.DECRE_PASSSLOTS();
      if (decre.data.success === 1) {
        try {
          setShowBackdrop(true);
          for (let i = 0; i < selectedRows.length; i++) {
            const row = selectedRows[i];
    
            if (passSlot.slots === 0) {
              setShowBackdrop(false);
              swal({
                text: 'No Slots Available',
                timer: 2000,
                buttons: false,
                icon: 'error',
              });
              break; 
            }
            const formData = new FormData();
            formData.append('email', row.email);
            formData.append('applicantNum', row.applicantNum);
            const res = await SetApplicant.SET_APPLICANT(formData);
            if (res.data.success === 1) {
              setPassSlot(decre.data.results[0]);
              setData(res.data.result);
              setPassscore(decre.data.results[0].passingscore);
              setSlots(decre.data.results[0].slots);
            } else {
              setShowBackdrop(false);
              swal({
                title: "Failed",
                text: "Something Went Wrong!",
                icon: "error",
                button: "OK",
              });
            }
          }
          setShowBackdrop(false);
          swal({
            title: "Success",
            text: "Updated!",
            icon: "success",
            button: "OK",
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        setShowBackdrop(false);
        swal({
          text: 'No Slots Available',
          timer: 2000,
          buttons: false,
          icon: 'error',
        });
        return;
      }
    };
    const FailedAll = async() =>{
      const selectedRows = failedSelectionModel.map((selectedRow) =>
        data.find((row) => row.applicantNum === selectedRow));
        setShowBackdrop(true);
        for (let i=0 ;i<selectedRows.length;i++){
          const row = selectedRows[i];
          const schoapplied = row.SchoIarshipApplied
          const batch = row.Batch
          const reason = 'Score did not Meet Passing Score'
          const formData = new FormData();
          formData.append('applicantNum',row.applicantNum)
          formData.append('Name',row.Name)
          formData.append('ScholarshipApplied', schoapplied)
          formData.append('batch',batch)
          formData.append('Reason',reason)
          formData.append('email',row.email)
          formData.append('isSend',isSend)
          const response = await FailedUser.FAILED_USER(formData)
          if(response.data.success === 1){
            setData(response.data.result);
            setIsSend('No')
          }else{
            setShowBackdrop(false);
            swal({
              title: "Failed",
              text: "Something Went Wrong!",
              icon: "error",
              button: "OK",
            });
          }
        }
        setShowBackdrop(false);
        swal({
          title: "Success",
          text: "Done!",
          icon: "success",
          button: "OK",
        });
    }
    const Access = async() =>{
      const formData = new FormData();
      formData.append('email',email);
      formData.append('password',password);
      formData.append('applicantNum',who)
      setShowBackdrop(true);
      await GrantAccess.GRANT_ACCESS(formData)
      .then(res => {
        if(res.data.success === 1){
          const ForEva = res.data.result?.filter(user => user.status === 'For Evaluation')
          setData(ForEva);
          setEmail('')
          setOpenDialog(false)
          setPassword('')
          setShowBackdrop(false);
          swal({
            text: res.data.message,
            timer: 2000,
            buttons: false,
            icon: 'success',
          });
        }else{
          setShowBackdrop(false);
          swal({
            text: res.data.message,
            timer: 2000,
            buttons: false,
            icon: 'error',
          });
        }

        }
         )
        .catch(err => console.log(err));
      
    }
    
    const Passed = data && data.length > 0
    ? data.filter(user => user.score >= passSlot.passingscore)
    : '';
    const Failed = data && data.length > 0
    ? data.filter(user => user.score < passSlot.passingscore)
    : '';
  return (
    <>
              <StyledBackdrop open={showBackdrop}>
                <CircularProgress color="inherit" />
              </StyledBackdrop>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Login to Grant Access</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will use for the special case scenario if the Admin, Employee or Mayor wants an applicants with a failed score to be passed
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            value={email}
            onChange={(e) =>setEmail(e.target.value)}
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            value={password}
            onChange={(e) =>setPassword(e.target.value)}
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button className='myButton' sx={{color:'white'}} onClick={handleCloseDialog}>Cancel</Button>
          <Button className='myButton1' sx={{color:'white'}} onClick={Access}>Submit</Button>
        </DialogActions>
      </Dialog>
    <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Applicant Information
            </Typography>
          </Toolbar>
        </AppBar>
      <Box sx={{width:'100%',padding:'10px',height:'100%',display:'flex',backgroundColor:'whitesmoke'}}>
         <div style={{width:'98%',padding:'10px'}}>
          <Card sx={{width:'100%',height:'100%'}}>
           <Card sx={{display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'blue',color:'white'}}><h1>APPLICATION FORM </h1></Card>
           <Card>
            <Typography sx={{paddingLeft:'60px',fontSize:'20px',fontWeight:'700'}}>Personal Information</Typography>
            <div style={{display:'flex',width:'95%',padding:'10px'}}>
              <div style={{width:'30%'}}>
                <Typography>
                  First Name:{applicantsInfo.firstName}
                </Typography>
                <Typography>
                  Last Name:{applicantsInfo.lastName}
                </Typography>
                <Typography>
                  Middle Name:{applicantsInfo.middleName}
                </Typography>
                <Typography>
                  Gender:{applicantsInfo.gender}
                </Typography>
              </div>
              <div style={{width:'30%'}}>
              <Typography>Citizenship: {applicantsInfo.citizenship}</Typography>
              <Typography>Date of Birth: {applicantsInfo.birthday}</Typography>
              <Typography>Age: {applicantsInfo.age}</Typography>
              <Typography>Birth Of Place: {applicantsInfo.birthPlace}</Typography>
              </div>
              <div style={{width:'37%'}}>
              <Typography>Contact Number: {applicantsInfo.contactNum}</Typography>
              <Typography>Email: {applicantsInfo.Email}</Typography>
              <Typography>Permanent Address: {applicantsInfo.caddress}</Typography>
              <Typography>Current Address: {applicantsInfo.paddress}</Typography>
              </div>
            </div>
            <Typography sx={{paddingLeft:'60px',fontSize:'20px',fontWeight:'700'}}>Economic Background</Typography>
            <div style={{display:'flex',width:'95%',padding:'10px'}}>
              <div style={{width:'100%'}}>
                <div style={{display:'flex'}}>
                <Typography sx={{whiteSpace:'nowrap'}}>
                 Where Do you Live: {applicantsInfo.wereLive} -
                </Typography>
                <p style={{backgroundColor:'green',textAlign:'center',padding:'5px',color:'white',borderRadius:'3px'}}>{userscore.wltotal}</p>
                </div>
                <div style={{display:'flex'}}>
                <Typography>
                  How Long you Live in Marilao: {applicantsInfo.howLong} - 
                </Typography>
                <p style={{backgroundColor:'green',textAlign:'center',padding:'5px',color:'white',borderRadius:'3px'}}>{userscore.hltotal}</p>
                </div>
                <div style={{display:'flex'}}>
                <Typography>
                  House Ownership: {applicantsInfo.ownerShip} -
                </Typography>
                <p style={{backgroundColor:'green',textAlign:'center',padding:'5px',color:'white',borderRadius:'3px'}}>{userscore.ostotal}</p>
                </div>
              </div>
              <div style={{width:'100%'}}>
                <div style={{display:'flex'}}>
                <Typography>
                  Parent(s)/Guardian Annual Gross Income: {applicantsInfo.monthIncome} -
                </Typography>
                <p style={{backgroundColor:'green',textAlign:'center',padding:'5px',color:'white',borderRadius:'3px'}}>{userscore.mitotal}</p>
                </div>
                <Typography>
                  Baranggay:{applicantsInfo.baranggay}
                </Typography>
              </div>
            </div>
            <Typography sx={{paddingLeft:'60px',fontSize:'20px',fontWeight:'700'}}>Family Information</Typography>
            <div style={{width:'100%',display:'flex'}}>
            <div style={{width:'30%',padding:'10px'}}>
            <Typography sx={{paddingLeft:'20px',fontSize:'18px',fontWeight:'500',textDecoration:'underline'}}>Mother Information</Typography>
            <div>
              <div style={{width:'100%'}}>
                <Typography>
                  First Name:{applicantsInfo.motherName}
                </Typography>
                <Typography>
                  Last Name:{applicantsInfo.motherlName}
                </Typography>
                <Typography>
                  Middle Name:{applicantsInfo.mothermName}
                </Typography>
              </div>
              <div style={{width:'100%'}}>
                <Typography>
                  Occupation:{applicantsInfo.motherOccu}
                </Typography>
                <Typography>
                  Highest Educational Attainment:{applicantsInfo.motherEduc}
                </Typography>
              </div>
            </div>
            </div>
            <div style={{width:'30%',padding:'10px'}}>
            <Typography sx={{paddingLeft:'20px',fontSize:'18px',fontWeight:'500',textDecoration:'underline'}}>Father Information</Typography>
            <div style={{width:'95%',padding:'10px'}}>
              <div style={{width:'100%'}}>
                <Typography>
                  First Name:{applicantsInfo.fatherName}
                </Typography>
                <Typography>
                  Last Name:{applicantsInfo.fatherlName}
                </Typography>
                <Typography>
                  Middle Name:{applicantsInfo.fathermName}
                </Typography>
              </div>
              <div style={{width:'100%'}}>
                <Typography>
                  Occupation:{applicantsInfo.fatherOccu}
                </Typography>
                <Typography>
                  Highest Educational Attainment:{applicantsInfo.fatherEduc}
                </Typography>
              </div>
            </div>
            </div>
            <div style={{width:'30%',padding:'10px'}}>
            <Typography sx={{paddingLeft:'20px',fontSize:'18px',fontWeight:'500',textDecoration:'underline'}}>Other Information</Typography>
              <div style={{display:'flex'}}>
              <Typography>Number of Family Members: {applicantsInfo.famNum} -</Typography>
              <p style={{backgroundColor:'green',textAlign:'center',padding:'5px',color:'white',borderRadius:'3px'}}>{userscore.fntotal}</p>
              </div>
              <Typography>Guardian: {applicantsInfo.guardianName}</Typography>
              <Typography>Contact Number: {applicantsInfo.guardianContact}</Typography>
              <Typography>Relationship: {applicantsInfo.relationship}</Typography>
            </div>
            </div>
            <Typography sx={{paddingLeft:'60px',fontSize:'20px',fontWeight:'700'}}>Educational Background</Typography>
            <div style={{display:'flex',width:'95%',padding:'10px'}}>
              <div style={{width:'100%'}}>
                <Typography>
                  Year Level:{applicantsInfo.currentYear}
                </Typography>
                <div style={{display:'flex'}}>
                <Typography>
                  Type of School: {applicantsInfo.typeSchool} -
                </Typography>
                <p style={{backgroundColor:'green',textAlign:'center',padding:'5px',color:'white',borderRadius:'3px'}}>{userscore.tstotal}</p>
                </div>
                <Typography>
                  School Name:{applicantsInfo.currentSchool}
                </Typography>
                <Typography>
                  School Address:{applicantsInfo.address}
                </Typography>
              </div>
              <div style={{width:'100%'}}>
                <Typography>
                  Degree Program/Course(Priority Course):{applicantsInfo.course}
                </Typography>
                <div style={{display:'flex'}}>
                <Typography>
                  General Weighted Average: {applicantsInfo.gwa} - 
                </Typography>
                <p style={{backgroundColor:'green',textAlign:'center',padding:'5px',color:'white',borderRadius:'3px'}}>{userscore.gwatotal}</p>
                </div>
                <div style={{display:'flex'}}>
                <Typography>
                  Financial Support: {applicantsInfo.financialSupport} -
                </Typography>
                <p style={{backgroundColor:'green',textAlign:'center',padding:'5px',color:'white',borderRadius:'3px'}}>{userscore.fatotal}</p>
                </div>
              </div>
            </div>
            <div style={{display:'flex',width:'95%',padding:'10px',justifyContent:'space-between'}}>
              <div style={{width:'30%'}}>
                <Typography sx={{paddingLeft:'20px',fontSize:'18px',fontWeight:'500',textDecoration:'underline'}}>Elementary Background</Typography>
                <Typography>
                  School Name:{applicantsInfo.elemSchool}
                </Typography>
                <Typography>
                  Address:{applicantsInfo.elemAddress}
                </Typography>
                <Typography>
                  School Year:{applicantsInfo.elemYear}
                </Typography>
                <Typography>
                  Award:{applicantsInfo.elemAward}
                </Typography>
              </div>
              <div style={{width:'30%'}}>
              <Typography sx={{paddingLeft:'20px',fontSize:'18px',fontWeight:'500',textDecoration:'underline'}}>Highschool Background</Typography>
              <Typography>
                  School Name:{applicantsInfo.highSchool}
                </Typography>
                <Typography>
                  Address:{applicantsInfo.highAddress}
                </Typography>
                <Typography>
                  School Year:{applicantsInfo.highYear}
                </Typography>
                <Typography>
                  Award:{applicantsInfo.highAward}
                </Typography>
              </div>
              <div style={{width:'30%'}}>
              <Typography sx={{paddingLeft:'20px',fontSize:'18px',fontWeight:'500',textDecoration:'underline'}}>College Background</Typography>
              <Typography>
                  School Name:{applicantsInfo.collegeSchool}
                </Typography>
                <Typography>
                  Address:{applicantsInfo.collegeAddress}
                </Typography>
                <Typography>
                  School Year:{applicantsInfo.collegeYear}
                </Typography>
                <Typography>
                  Award:{applicantsInfo.collegeAward}
                </Typography>
              </div>
            </div>
           </Card>
          </Card>
         </div>
      </Box>
    </Dialog>
    <div style={{width:'100%'}}>
           <div className="scholars">
        <Sidebar/>
        <div className="scholarsContainer" style={{backgroundColor:'#f1f3fa'}}>
            <Navbar/>
            <Card sx={{width:'97%',margin:'10px',padding:'10px',display:'flex',justifyContent:'flex-end',flexDirection:'column',alignItems:'flex-end'}} elevation={0}>
            <div className='evluationcon'>
              <div style={{width:'100%',height: 100,display:'flex',justifyContent:'space-between',padding:10}}>
                  <div style={{width:'30%',display:'flex',flexDirection:'column',justifyContent:'space-between',height:'100%'}}>
                  <h1 style={{color:'#666'}}>Registered Applicants</h1>
                  </div>
                  <div style={{marginRight:5,height:'100%'}}>
                    <div style={{display:'flex',flexDirection:'column',height:'100%',width:'100%',alignItems:'center'}}>
                      <div style={{width:'100%',alignItems:'center',justifyContent:'center',display:'flex',margin:10}}>
                    <TextField
                        id="outlined-number"
                        label="Passing Score"
                        type="text"
                        size='small'
                        placeholder={passSlot.passingscore}
                        sx={{width:'30%',marginRight:5}}
                        value={passscore}
                        onChange={(e) => setPassscore(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    <TextField
                        id="outlined-number"
                        label="Available Slot"
                        placeholder={passSlot.slots}
                        type="text"
                        size='small'
                        sx={{width:'30%'}}
                        onChange={(e) =>setSlots(e.target.value)}
                        value={slots}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      </div>
                      <div>
                      {isButtonVisible && <Button className='myButton1' onClick={ScoreSlot} variant='contained' size='small'>Save Changes</Button>}
                      </div>
                    </div>
                  </div>
              </div>
              <Box sx={{ height: 400, width: '100%' }}>
                <Card sx={{height:'100%'}}>
                <Breadcrumbs sx={{backgroundColor:'green'}} aria-label="breadcrumb">
                  <Button onClick={() => setActiveState('All')}>
                    <Link
                      underline="none"
                      sx={{
                        color: activeState === 'All' ? 'white' : 'black',
                      }}
                    >
                      <FormatListBulletedOutlinedIcon fontSize="inherit" />
                      All({data.length})
                    </Link>
                  </Button>
                  <Button onClick={() => setActiveState('Passed')}>
                    <Link
                      underline="none"
                      sx={{
                        color: activeState === 'Passed' ? 'white' : 'black',
                      }}
                    >
                      <CheckCircleIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                      Passed({Passed.length})
                    </Link>
                  </Button>
                  <Button onClick={() => setActiveState('Failed')}>
                    <Link
                      underline="none"
                      sx={{
                        color: activeState === 'Failed' ? 'white' : 'black',
                      }}
                    >
                      <CancelIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                      Failed({Failed.length})
                    </Link>
                  </Button>
                  </Breadcrumbs>
                    {activeState === 'All' && (data && data.length > 0 ? (
                  <DataGrid
                    rows={data}
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
                    checkboxSelection
                    disableRowSelectionOnClick
                  />
                ) : (
                  <div style={{width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'whitesmoke'}}>
                  <p style={{ textAlign: 'center',fontSize:30,fontWeight:700,fontStyle:'italic' }}>No records</p>
                  </div>
                ))}
                  {activeState === 'Passed' && (Passed && Passed.length > 0 ? (
                    <DataGrid
                      rows={Passed}
                      columns={passedColumn}
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
                      checkboxSelection
                      onRowSelectionModelChange={handleRowSelectionModelChange}
                      rowSelectionModel={rowSelectionModel}
                      disableRowSelectionOnClick
                    />
                  ) : (
                    <div style={{width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'whitesmoke'}}>
                    <p style={{ textAlign: 'center',fontSize:30,fontWeight:700,fontStyle:'italic' }}>No records</p>
                    </div>
                  ))}
                  {activeState === 'Failed' && (Failed && Failed.length > 0 ? (
                    <DataGrid
                      rows={Failed}
                      columns={failedColumn}
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
                      checkboxSelection
                      onRowSelectionModelChange={handleFailedSelectionModelChange}
                      rowSelectionModel={failedSelectionModel}
                      disableRowSelectionOnClick
                    />
                  ) : (
                    <div style={{width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'whitesmoke'}}>
                    <p style={{ textAlign: 'center',fontSize:30,fontWeight:700,fontStyle:'italic' }}>No records</p>
                    </div>
                  ))}
                </Card>
              </Box>
              
            </div>
            {activeState === 'Passed' && <div sx={{width:'90%',margin:'10px',display:'flex',justifyContent:'flex-end',flexDirection:'column',alignItems:'flex-end'}}>
              <Button className='myButton' onClick={Addall} sx={{margin:'10px'}} variant='contained'>ADD ALL SELECTED TO APPLICANT LIST</Button>
            </div>}
            {activeState === 'Failed' && <div sx={{width:'90%',margin:'10px',display:'flex',justifyContent:'flex-end',flexDirection:'column',alignItems:'flex-end'}}>
                  <Checkbox
                    checked={checked}
                    onChange={handleChangeCheckbox}
                    inputProps={{ 'aria-label': 'controlled' }}
                  /><span>Sent Notification</span>
                <Button className='myButton2' onClick={FailedAll} sx={{margin:'10px'}} variant='contained'>SET FAILED THE SELECTED USERS</Button>
            </div>}
            </Card>
        </div>
    </div>
    </div>
    </>
  )
}

export default Evaluation