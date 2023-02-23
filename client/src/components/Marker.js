import { useEffect, useState } from "react";
import { useUser } from "./context/UserContext";
import { useSelectedUser } from "./context/SelectedUserContext";
import { useDates, useDatesDispatch } from "./context/DatesContext";

function Marker({ map }) {
  const uid = useUser().id;
  const so_uid = useSelectedUser().selectedUser;
  const [errors, setErrors] = useState([]);
  const dates = useDates().dates;
  const datesDispatch = useDatesDispatch();

  useEffect(() => {
    fetch(`/user/${uid}/dates/${so_uid}`).then((response) => {
      if (response.ok) {
        response.json().then((dates) =>
          datesDispatch({
            type: "mount",
            dates: dates,
          })
        );
      } else {
        response.json().then((errors) => setErrors(errors));
      }
    });
  }, []);

  const renderMarkers = dates ? (
    dates.map((date) => {
      const content = `
                    <div class="info-window">
                        <h6 class="info-window-text">${date.name}</h6>
                        <p class="info-window-text">${date.date}</p>
                        <p class="info-window-text">${date.notes}<p>
                    </div>
                    `;

      const marker = new window.google.maps.Marker({
        position: JSON.parse(date.location),
        map: map,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: content,
        ariaLabel: `${date.name}`,
      });

      marker.addListener("click", () => {
        infoWindow.open({
          anchor: marker,
          map,
        });
      });
    })
  ) : (
    <></>
  );

  return <>{renderMarkers}</>;
}

export default Marker;
