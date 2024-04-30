import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import "./Login.css"
import { getUserByEmail } from "../../services/userService";
import lowBlip from "../../assets/LowBlip.mp3";
import mediumBlip from "../../assets/MediumBlip.mp3";
import highBlip from "../../assets/HighBlip.mp3";
import animatedGif from "../../assets/CloudCaddiInClubhouse.gif";
import staticGif from "../../assets/staticGif.png";
import successSound from "../../assets/success.wav";
import staticGif2 from "../../assets/OwlbertEinsteinGif.gif";

export const Login = () => {
  const [email, set] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    return getUserByEmail(email).then((foundUsers) => {
      if (foundUsers.length === 1) {
        const user = foundUsers[0];
        localStorage.setItem(
          "Caddi_User",
          JSON.stringify({
            id: user.id,
            isAdmin: user.isAdmin,
          })
        );

        navigate("/");
      } else {
        window.alert("Invalid login");
      }
    });
  };

  return (
    <div className="big-kahuna">
      <main className="auth-container">
        <section>
          <form className="auth-form" onSubmit={handleLogin}>
            <h1 className="header699">CLOUD CADDI</h1>

            <fieldset className="auth-fieldset">
              <div>
                <input
                  type="email"
                  value={email}
                  className="auth-form-input"
                  onChange={(evt) => set(evt.target.value)}
                  placeholder="mattrnovotny@gmail.com"
                  required
                  autoFocus
                />
              </div>
            </fieldset>
            <fieldset className="auth-fieldset">
              <div>
                <button className="fun-button" type="submit">
                  Sign in
                </button>
              </div>
            </fieldset>
          </form>
        </section>
        <section className="register-link">
          <Link to="/register">Not a member yet?</Link>
        </section>
        <img src={staticGif2} className="Login-Mascot" />
        <img src={animatedGif} className="Login-Mascot2" />
      </main>
    </div>
  );
};
