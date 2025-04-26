// src/App.jsx

import React from 'react';
import { Box } from '@mui/material';
import {BrowserRouter as Router, Route, Routes, createBrowserRouter, createRoutesFromElements} from 'react-router-dom';
import { routes } from './routes/routes';
import { type RouterType } from './types/routersTypes';
import Layout from './features/layouts/Layout';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      routes.map((route: RouterType) => (
        <Route key={route.path} {...route} />
      ))
    )
  );

  return (
    <Box className="app">
      <Router>
          <Layout> 
        <Routes>
            {/* <RouterProvider router={router} /> */}
            {routes.map((route: RouterType) => (
            <Route key={route.path} {...route} />
          ))}
          
        </Routes>
        </Layout>
        
      </Router>
    </Box>
  );
}

export default App;
