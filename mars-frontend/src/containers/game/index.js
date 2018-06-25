import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Header from '../../components/gameBoard/header';
import Navigation from '../../components/gameBoard/navigation';
import CompanySection from '../../components/gameBoard/companySection';
import FlexibleCharts from './home/newTimeLine';
import Div from './div';
import "./game.css";
import {connect} from 'react-redux';
import DialogBox from "../../components/dialogBox/index";

const styles = theme => ({
    root: {
        width:'100%',
        maxWidth:'100%',
        minWidth:'100%',
        height:'100vh',
        maxHeight:'100vh',
        minHeight:'100vh',
        margin:0,
        padding:0,
        boxSizing:'border-box',
        backgroundColor:'#111',
        flexgrow:1,
    },
    changeTheme:{
        backgroundColor:'#444',
    },
    gridMiddle:{
        height:50+'%'
    },
    adjestHeight:{
        height:'35vh',
    },
    paper: {
        padding: theme.spacing.unit * 3,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

class FullWidthGrid extends React.Component {

    constructor(props){
        super(props);
        this.state={
            bankBalance:this.props.user.user.balance,
            stocks:this.props.user.game.stocks,
            turn:this.props.user.game.turn+1,
            timeLeft:60
        }
    }
    componentDidMount(){
        setInterval(()=> {
            this.setState({
                timeLeft:this.state.timeLeft === 0 ? this.state.timeLeft : this.state.timeLeft-1
            })
        },1000)
    }

    componentWillReceiveProps(nextProps){

    }

    render(){
        const { classes } = this.props;
        return (
            <div className={classes.root}>

                <Grid container>
                    {/* header container */}
                    <Grid container>
                        <Grid item xs={12} sm={12}>
                            <Header balance={this.state.bankBalance} turn={this.state.turn} timeLeft={this.state.timeLeft}/>
                        </Grid>
                    </Grid>

                    {/* elements container */}
                    <Grid container className={classes.changeTheme}>
                        {/* profile section */}
                        <Grid item xs={12} sm={2} className={classes.adjestHeight}>
                            <Navigation/>
                        </Grid>

                        {/* element section */}
                        <Grid item xs={12} sm={10}>
                            <Grid container>
                                {/* company section */}
                                <Grid item xs={12} sm={7}>
                                    <CompanySection stocks={this.state.stocks}/>
                                </Grid>

                                {/* chart section */}
                                <Grid item xs={12} sm={5}>
                                    <FlexibleCharts/>
                                </Grid>
                            </Grid>

                            <Grid container>
                                {/* under section 1 */}
                                <Grid item xs={12} sm={7}>
                                    <Div/>
                                </Grid>

                                {/* under section 2 */}
                                <Grid item xs={12} sm={5}>
                                    <Div/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

FullWidthGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(
    state => {
        return {
            user: state.user
        }
    }

)(withStyles(styles)(FullWidthGrid));