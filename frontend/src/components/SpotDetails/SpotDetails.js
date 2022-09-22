import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as spotsActions from '../../store/spots';
import * as bookingsActions from '../../store/bookings';
import SpotBookings from '../SpotBookings';
import './SpotDetails.css';

export default function SpotDetails() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const sessionUser = useSelector(state => state.session.user);
    const spot = useSelector(state => state.spots.singleSpot);
    const spotBookings = useSelector(state => state.bookings.spot);
    useEffect(() => {
        dispatch(spotsActions.getSingleSpot(spotId));
        dispatch(bookingsActions.getSpotBookings(spotId));
    }, [dispatch, spotId, sessionUser]);

    console.log("SPOT", spot);

    if (!spot || !Object.entries(spot).length) return null;

    return (
        <main id='spot-details--page-container'>
            <div className='spot-details--container'>
                <h1 id='spot-details--title-main'>{spot.name}</h1>

                <div className='spot-details--sub-title-reviews'>
                    <span className='spot-details--sub-title-rating'>
                        <i className="fa-solid fa-star icon--star" />
                        {spot.avgStarRating}
                    </span>
                    <span className='spot-details--sub-title-dot'> · </span>
                    <span className='spot-details--sub-title-numReviews'>{spot.numReviews} reviews</span>
                    <span className='spot-details--sub-title-dot'> · </span>
                    <span className='spot-details--sub-title-owner'>{spot.city}, {spot.state}, {spot.country}</span>
                </div>

                <div className='spot-details--imgs-container'>
                    {spot.spotImages.map(img => (
                        <img key={img.url} src={img.url} alt={img.url} className='spot-details--img' />
                    ))}
                </div>

                <div className='spot-details--title-host-info'>
                    <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                </div>

                <div className='spot-details--description-container'>
                    <p className='spot-details--description'>{spot.description}</p>
                </div>

                <div className='spot-bookings--container'>
                        <SpotBookings
                            spot={spot}
                            user={sessionUser}
                            bookings={spotBookings}
                        />
                </div>
            </div>
        </main>
    )
}
