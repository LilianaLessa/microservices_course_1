import 'bootstrap/dist/css/bootstrap.css'

const ComponentWrapper = ({ Component, pageProps }) => {
    return <Component {...pageProps}/>
};

export default ComponentWrapper;
