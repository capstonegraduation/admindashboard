const Endpoints = {
    FETCH_APPLICANTS:"personalinfo/applicants",
    FETCH_USER_BY_ID:"userProf/UserAccounts",
    FETCH_ACCOUNTS:"userProf/UserAccounts",
    SET_REMARKS:"userProf/Remarks",
    CREATE_SCHOLAR:"scholar/createScho",
    CREATE_NEWS:"news/create",
    FETCH_NEWS: 'news/newsinfo',
    FETCH_ADMIN:"admin/login",
    LOGIN_USER:"user/login",
    FETCH_APPLICANTSINFO: 'personalinfo/ApplicantFdetails/',
    FETCH_SUBMITTED: 'requirements/',
    CHECK_SUBMITTED: 'requirements/Check',
    CHECK_APPLICANTS: 'requirements/CheckApplicants',
    FETCH_QUALIFIED: 'Appointment/List',
    CREATE_APPOINT: 'Appointment/appoint',
    FETCH_APPOINTLIST: 'Appointment/appointList',
    FETCH_SCHOPROG: 'scholar/schoCat',
    UPDATE_SCHOPROG: 'scholar/UpdateStatus',
    RE_APPOINT: 'Appointment/Reappointed',
    SET_APPROVED: 'Appointment/SetApproved',
    SET_APPLICANT: 'Appointment/SetApplicants',
    ADD_APPLICANTLIST: 'Appointment/Addusertolist',
    UPDATE_SCHEDULE: 'Appointment/UpdateSchedule',
    CANCEL_APP: 'Appointment/CancelApp',
    CANCEL_BATCH: 'Appointment/CancelBatch',
    FETCH_APPLI: 'Appointment/Applist',
    FETCH_BATCH: 'Appointment/Batchlist',
    FAILED_USER: 'Appointment/Failed',
    SET_INTERVIEW: 'Appointment/Interview',
    FETCH_USERINFORMATION: 'Appointment/UserDetails/',
    FETCH_BMCCSCHOLAR: 'BMCCScholar/Scholars',
    UPDATE_BMCCSCHOLAR: 'BMCCScholar/Schostanding',
    FETCH_BMCCSCHOLARINFO: 'BMCCScholar/SchoInfo/',
    CREATE_SCORECARD: 'Scorecard/score',
    FETCH_SCORECARD: 'Scorecard/getScore/',
    FETCH_USERSCORE: 'Scorecard/UserScore/',
    LIST_REQUIREMENTS: 'documents/Requirements',
    ADD_REQUIREMENTS: 'documents/AddRequirements',
    UPDATE_REQUIREMENTS: 'documents/UpdateDeadline',
    DELETE_REQUIREMENTS: 'documents/DeleteReqid',
    FETCH_DOCUMENTARY: 'documents/Documentary',
    BMCC_ADD: 'admin/Create',
    BMCC_FETCH: 'admin/BMCCmembers',
    ACTIVITY_LOG: 'admin/Activitylog',
    UPDATE_EMP: 'admin/Update',
    UPDATE_PASS: 'admin/Updatepassword',
    UPDATE_PROFILE: 'admin/Updateprofile',
    FETCH_ANNOUNCEMENT:'announce/Announced',
    FETCH_REPORTAPP:'Reports/Applicants',
    FETCH_REPORTSCHO:'Reports/Scholars',
    FETCH_REPORTUSER:'Reports/UserAccounts',
    SET_OFFLINE:"admin/Logout",
    GRANT_ACCESS:"admin/GrantAccess",
    CREATE_ANNOUNCEMENT:'announce/createannounced',
    UPDATE_SCORESLOT:'Dynamic/Update',
    FETCH_SCORESLOT:'Dynamic/PassSlot',
    DECRE_SCORESLOT:'Dynamic/DecreSlot',
}

export default Endpoints