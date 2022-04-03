import "./widget.scss";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

const Widget = ({ type }) => {
    let data;

    switch (type) {
        case "guest":
            data = {
                title: "GUESTS",
                counter: "12000",
                link: "About guests",
                percentage: 0.5,
                state: "positive",
                icon: <PersonOutlineOutlinedIcon className="icon"/>
            }
        break;
        case "member":
            data = {
                title: "MEMBERS",
                counter: "9865",
                link: "See all members",
                percentage: 2,
                state: "positive",
                icon: <PersonOutlineOutlinedIcon className="icon"/>
            }
        break;
        case "translator":
            data = {
                title: "TRANSLATOR",
                counter: "56",
                link: "See all translators",
                percentage: 0,
                state: "positive",
                icon: <PersonOutlineOutlinedIcon className="icon"/>
            }
        break;
        case "maneger":
            data = {
                title: "MANEGERS",
                counter: "3",
                link: "See all manegers",
                percentage: 0,
                state: "positive",
                icon: <PersonOutlineOutlinedIcon className="icon"/>
            }
        break;
        default:
        break;
    }
    return (
        <div className="widget">
            <div className="left">
                <span className="title">{data.title}</span>
                <span className="counter">{data.counter}</span>
                <span className="link">{data.link}</span>
            </div>
            <div className="right">
                <div className={"percentage "+data.state}> {/* negative */}
                    {data.state=="positive" ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    {data.percentage}%
                </div>
                {data.icon}
            </div>
        </div>
    );
};

export default Widget;