import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import auth from './auth'


const ProtectedRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={
            (props) => {
                console.log("trying to access protected route...")
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
        }/>
    )
}

export default ProtectedRoute;

/*
class ProtectedRoute extends Component {
    render() {
        const Component = this.props.component;
        const isAuthenticated = this.props.loggedIn;
        console.log("what is the component? ", Component);
        console.log("is authenticated? ", isAuthenticated);
        return isAuthenticated ? (
            <Component />
        ) : (
            <Redirect to={{ pathname: '/login' }} />
        );
    }
}*/

//export default ProtectedRoute;