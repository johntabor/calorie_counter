import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import auth from './auth'


const ProtectedRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={
            (props) => {
                /*
                return auth.isAuthenticated()
                    .then(authenticated => {
                        console.log('authenticated? ', authenticated)
                        if (authenticated) {
                            return <Component {...props} />
                        } else {
                            return <Redirect to={
                                {
                                    pathname: '/login',
                                    state: {
                                        from: props.location
                                    }
                                }
                            } />
                        }
                    }) */
                
                if (auth.isAuthenticated()) {
                    return <Component {...props} />
                } else {
                    return <Redirect to={
                        {
                            pathname: "/login",
                            state: {
                                from: props.location
                            }
                        }
                    } />
                } 
            }
        } />
    )
}

export default ProtectedRoute;