import photo from '../assets/12.png';
import calendar from '../assets/Calendar.png';
import '../styles/globals.css';
import { useAuth } from '../context/AuthContext';

function Profile() {
    const { user } = useAuth();
    const name = user?.user_metadata?.full_name || user?.email;
    const joined = user ? new Date(user.created_at).toLocaleDateString() : "";

    return(
        <>
            <h1>Your Profile</h1>

            {/*profile row with profile statistics*/}
            <div className="profile-overview-row">

                {/*profile personal information card*/}
                <div className="profile-card">
                    <img src={photo} alt="" className="profile-image" />
                    <div className="profile-info">
                        <h1>{name}</h1>
                        <div className="date-row">
                            <img className="calendar-icon" src={calendar} alt=""/>
                            <p>Joined on: {joined}</p>
                        </div>
                    </div>
                </div>

                {/*column of statistics*/}
                <div className="stats-column">

                    {/*recipes made card*/}
                    <div className="recipe-made-card">
                        <h1>2</h1>
                        <p>Recipes Made</p>
                    </div>

                    {/*countries explored card*/}
                    <div className="countries-explored-card">
                        <h1>1</h1>
                        <p>Countries Explored</p>
                    </div>

                </div>
            </div>

            {/*recently made recipes*/}
            <h2>Recently Made</h2>
            <div className="recently-made"></div>
        </>
    )
}

export default Profile;
