import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Drawer, Box, List, ListItem, ListItemText, Button, TextareaAutosize, AppBar, Toolbar, Typography, TextField, Grid } from '@mui/material';
import { styled } from '@mui/system';
import HomeIcon from '@mui/icons-material/Home';
import './LandingPage.css';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import SettingsIcon from '@mui/icons-material/Settings';
import SendIcon from '@mui/icons-material/Send';
import { clearUser } from '../Redux/userSlice';
import { persistor } from '../Redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { selectUserName } from '../Redux/userSelectors';


const GlassBox = styled(Box)({
    background: 'linear-gradient(to right, rgba(0, 0, 0, 0.5) 25.5%, rgba(0, 0, 0, 0.25) 25%)',
    backdropFilter: 'blur(10px)',
    borderRadius: 25,
    padding: 16,
    margin: 8,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',

    border: '1px solid rgba(255, 255, 255, 0.3)',
});



const LandingPage = () => {
    const [files, setFiles] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const drawerWidth = 240;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userName = useSelector(selectUserName)
    const auth = getAuth();
    const onDrop = useCallback(acceptedFiles => {
        setFiles([...files, ...acceptedFiles]);
    }, [files]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'application/pdf' });

    const removeFile = (file) => {
        setFiles(files.filter(item => item !== file));
    };

    const uploadFiles = async () => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        try {
            const response = await axios.post('0000000', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSubmitMessage('Files uploaded successfully');
            console.log('Server response:', response.data);
        } catch (error) {
            setSubmitMessage('Error uploading files');
            console.error('Upload error:', error);
        }
    };

    const handleSubmit = () => {
        setSubmitMessage('Your files are being uploaded...');
        uploadFiles();
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };


    const handleSignOut = () => {
        signOut(auth).then(() => {
            dispatch(clearUser());
            persistor.purge();
            navigate('/login');
        }).catch((error) => {
            console.error('Sign out error', error);
        });
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(0, 0, 0, 0.7)',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ marginTop: '-50px', paddingBottom: '16px', paddingLeft: '16px' }}>
                    <List>
                        <ListItemText style={{ paddingLeft: '8px', color: 'white' }} primary={"Hello "+userName+"!"} />
                    </List>
                </Box>
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        { }
                        <ListItem button key='Home'>
                            <HomeIcon style={{ color: 'white' }} />
                            <ListItemText style={{ paddingLeft: '8px', color: 'white' }} primary={'Home'} />
                        </ListItem>
                        <ListItem button key='Help'>
                            <HelpCenterIcon style={{ color: 'white' }} />
                            <ListItemText style={{ paddingLeft: '8px', color: 'white' }} primary={'Help'} />
                        </ListItem>
                        <ListItem button key='Settings'>
                            <SettingsIcon style={{ color: 'white' }} />
                            <ListItemText style={{ paddingLeft: '8px', color: 'white' }} primary={'Settings'} />
                        </ListItem>
                    </List>
                </Box>
                {/* Vertical gap */}
                <Box sx={{ flexGrow: 1 }} />
                {/* Signout button */}
                <Box sx={{ paddingBottom: '16px', paddingLeft: '16px' }}>
                    <List>
                        <ListItem onClick={() => { handleSignOut() }} button key='SignOut'>
                            <ListItemText style={{ paddingLeft: '8px', color: 'white' }} primary={'Sign Out'} />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <GlassBox>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Typography fontWeight={'bold'} component="div">Your Files</Typography>
                            <input type="text" class="transparent-input" placeholder="Search" />

                            <List style={{ marginTop: '10px' }}>
                                {files.filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase())).map((file, index) => (
                                    <ListItem style={{ maxWidth: '195px', fontSize: "small" }} key={index} secondaryAction={
                                        <Button style={{ paddingLeft: '100px' }} onClick={() => removeFile(file)}>X</Button>
                                    }>
                                        {file.name}
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                        <Grid item xs={9}>
                            <Typography fontWeight={'bold'} component="div">Upload New Files</Typography>
                            <div {...getRootProps({ className: 'dropzone' })}
                                style={{ marginTop: '10px' }}>
                                <input {...getInputProps()} />
                                {isDragActive ?
                                    <p>Drop the files here ...</p> :
                                    <p>Drag 'n' drop some files here, or click to select files</p>

                                }
                            </div>
                            <div>
                                <textarea
                                    aria-label="empty textarea"
                                    placeholder="Ask Anything.."
                                    style={{ width: '100%', marginTop: '20px' }}
                                    minRows={3}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className='propmtzone'

                                />
                                <SendIcon style={{ marginLeft: '20px' }} />
                                {submitMessage && (
                                    <Typography variant="body2" color="text.secondary" sx={{ marginTop: '20px' }}>{submitMessage}</Typography>
                                )}
                            </div>

                        </Grid>
                    </Grid>
                </GlassBox>
            </Box>
        </Box>
    );
};

export default LandingPage;
