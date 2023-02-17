import { useState, useEffect } from "react";
import { useProfile } from "./context/ProfileContext";
import { useUser } from "./context/UserContext";
import { ReactComponent as RingSymbol } from "../ring-symbol.svg";
import { ReactComponent as MarriageSymbol } from "../marriage-symbol.svg";
import { ReactComponent as MovedInSymbol } from "../moved-in-together-symbol.svg";
import { ReactComponent as PregnancySymbol } from "../pregnancy-symbol.svg";
import { ReactComponent as BabySymbol } from "../baby-symbol.svg";
import { ReactComponent as AdoptionSymbol } from "../adoption-symbol.svg";
import { ReactComponent as FirstDateSymbol } from "../first-date-symbol.svg";
import { ReactComponent as OfficialSymbol } from "../official-symbol.svg";
import { ReactComponent as DeleteButton } from "../opinion-delete-button.svg";
import Modal from "react-bootstrap/Modal";

function RelationshipTimeline() {
    
    const uid = useProfile().profile;
    const currentUserId = useUser().user.id;
    const [milestones, setMilestones] = useState([]);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        fetch(`/user/${uid}/milestones`)
        .then((res) => {
            if (res.ok) {
                res.json().then(milestones => setMilestones(milestones));
            } else {
                res.json().then(errors => setErrors(errors));
            };
        });
    }, [uid]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [targetPost, setTargetPost] = useState(0);

    function handleDeleteClick(postId) {
        setTargetPost(postId);
        setShowDeleteModal(true);
    };

    function handleCancel() { 
        setTargetPost(0);
        setShowDeleteModal(false);
    };

    function handleDelete(postId) {
        const deleteRequest = {
            "method": "DELETE",
            "headers": { "Content-Type": "application/json" }
        };
        
        fetch(`/milestones/${postId}`, deleteRequest)
        .then(response => {
            if (response.ok) {
                response.json().then( milestone => setMilestones((milestones).filter(originalMilestone => originalMilestone.id ==! milestone.id)))
            } else {
                response.json().then(errors => setErrors(errors))
            }
        })
    };

    function createMilestonePosts(milestone) {
        if (milestone.type_of === "engagement") {
            return (
                <div className="milestone-card">
                    <RingSymbol className="milestone-symbol"/>
                    <div className="milestone-body">
                        {
                            milestone.creator_id === uid &&
                                <p className="milestone-text">Became engaged to {milestone.partner.full_name}</p>
                        }

                        {
                            milestone.partner_id === uid &&
                                <p className="milestone-text">Became engaged to {milestone.creator.full_name}</p>
                        }
                        <p className="milestone-text">{milestone.date}</p>
                    </div>
                    {
                        uid === currentUserId &&
                        <DeleteButton className="milestone-delete-button" onClick={() => handleDeleteClick(milestone.id)} />
                    }
                </div>
            )
        } else if (milestone.type_of === "marriage") {
            return (
                <div className="milestone-card">
                    <MarriageSymbol className="milestone-symbol"/>
                    <div className="milestone-body">
                        {
                            milestone.creator_id === uid &&
                                <p className="milestone-text">Married {milestone.partner.full_name}</p>
                        }

                        {
                            milestone.partner_id === uid &&
                                <p className="milestone-text">Married {milestone.creator.full_name}</p>
                        }
                        <p className="milestone-text">{milestone.date}</p>
                    </div>
                    {
                        uid === currentUserId &&
                        <DeleteButton className="milestone-delete-button" onClick={() => handleDeleteClick(milestone.id)} />
                    }
                </div>
            )
        } else if (milestone.type_of === "moved in together") {
            return (
                <div className="milestone-card">
                    <MovedInSymbol className="milestone-symbol"/>
                    <div className="milestone-body">
                        {
                            milestone.creator_id === uid &&
                                <p className="milestone-text">Began living with {milestone.partner.full_name}</p>
                        }

                        {
                            milestone.partner_id === uid &&
                                <p className="milestone-text">Began living with {milestone.creator.full_name}</p>
                        }
                        <p className="milestone-text">{milestone.date}</p>
                    </div>
                    {
                        uid === currentUserId &&
                        <DeleteButton className="milestone-delete-button" onClick={() => handleDeleteClick(milestone.id)} />
                    }
                </div>
            )
        } else if (milestone.type_of === "pregnancy") {
            return (
                <div className="milestone-card">
                    <PregnancySymbol className="milestone-symbol"/>
                    <div className="milestone-body">
                        {
                            milestone.creator_id === uid &&
                                <p className="milestone-text">Is having a baby with {milestone.partner.full_name}</p>
                        }

                        {
                            milestone.partner_id === uid &&
                                <p className="milestone-text">Is having a baby with {milestone.creator.full_name}</p>
                        }
                        <p className="milestone-text">{milestone.date}</p>
                    </div>
                    {
                        uid === currentUserId &&
                        <DeleteButton className="milestone-delete-button" onClick={() => handleDeleteClick(milestone.id)} />
                    }
                </div>
            )
        } else if (milestone.type_of === "welcomed a baby") {
            return (
                <div className="milestone-card">
                    <BabySymbol className="milestone-symbol"/>
                    <div className="milestone-body">
                        {
                            milestone.creator_id === uid &&
                                <p className="milestone-text">Welcomed a baby with {milestone.partner.full_name}</p>
                        }

                        {
                            milestone.partner_id === uid &&
                                <p className="milestone-text">Welcomed a baby with {milestone.creator.full_name}</p>
                        }
                        <p className="milestone-text">{milestone.date}</p>
                    </div>
                    {
                        uid === currentUserId &&
                            <DeleteButton className="milestone-delete-button" onClick={() => handleDeleteClick(milestone.id)} />
                    }
                </div>
            )
        } else if (milestone.type_of === "adopted a child") {
            return (
                <div className="milestone-card">
                    <AdoptionSymbol className="milestone-symbol"/>
                    <div className="milestone-body">
                        {
                            milestone.creator_id === uid &&
                                <p className="milestone-text">Adopted a child with {milestone.partner.full_name}</p>
                        }

                        {
                            milestone.partner_id === uid &&
                                <p className="milestone-text">Adopted a child with {milestone.creator.full_name}</p>
                        }
                        <p className="milestone-text">{milestone.date}</p>
                    </div>
                    {
                        uid === currentUserId &&
                            <DeleteButton className="milestone-delete-button" onClick={() => handleDeleteClick(milestone.id)} />
                    }
                </div>
            )
        } else if (milestone.type_of === "first date") {
            return (
                <div className="milestone-card">
                    <FirstDateSymbol className="milestone-symbol"/>
                    <div className="milestone-body">
                        {
                            milestone.creator_id === uid &&
                                <p className="milestone-text">Had their first date with {milestone.partner.full_name}</p>
                        }

                        {
                            milestone.partner_id === uid &&
                                <p className="milestone-text">Had their first date with {milestone.creator.full_name}</p>
                        }
                        <p className="milestone-text">{milestone.date}</p>
                    </div>
                    {
                        uid === currentUserId &&
                            <DeleteButton className="milestone-delete-button" onClick={() => handleDeleteClick(milestone.id)} />
                    }
                </div>
            )
        } else if (milestone.type_of === "became official") {
            return (
                <div className="milestone-card">
                    <OfficialSymbol className="milestone-symbol"/>
                    <div className="milestone-body">
                        {
                            milestone.creator_id === uid &&
                                <p className="milestone-text">Started a relationship with {milestone.partner.full_name}</p>
                        }

                        {
                            milestone.partner_id === uid &&
                                <p className="milestone-text">Started a relationship with {milestone.creator.full_name}</p>
                        }
                        <p className="milestone-text">{milestone.date}</p>
                    </div>
                    {
                        uid === currentUserId &&
                            <DeleteButton className="milestone-delete-button" onClick={() => handleDeleteClick(milestone.id)} />
                    }
                </div>
            )
        }
    };

    const renderInitialRelationshipTimeline = 
        milestones.length > 0 ?
            milestones.slice(0, 2).map((milestone) => {
                return (
                    createMilestonePosts(milestone)
                );
            })
            : <></>
    
    const renderFullRelationshipTimeline =
            milestones.length > 0 ?
                milestones.map((milestone) => {
                    return (
                        createMilestonePosts(milestone)
                    );
                }) : <></>
    
    const [showFullRelationshipTimeline, setShowFullRelationshipTimeline] = useState(false);

    return (
        <>
            {
                milestones.length > 0 &&
                <>
                    <div id="relationship-timeline-container">
                        <div id="relationship-timeline-header">
                            <p className="relationship-timeline-title">Relationship Timeline</p>
                        </div>
                        {renderInitialRelationshipTimeline}
                        <p className="relationship-timeline-show-more" onClick={() => setShowFullRelationshipTimeline(true)}>Show more...</p>
                    </div>

                    <Modal show={showDeleteModal} onHide={handleCancel}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Delete Milestone
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Are you sure you want to delete this milestone?</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <button onClick={() => handleCancel()}>Cancel</button>
                            <button onClick={() => handleDelete(targetPost)}>Confirm</button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showFullRelationshipTimeline} onHide={() => setShowFullRelationshipTimeline(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Relationship Timeline</Modal.Title>
                        </Modal.Header>
                            
                        <Modal.Body>
                            <div className="full-relationship-timeline-container">
                                {renderFullRelationshipTimeline}
                            </div>
                        </Modal.Body>

                        <Modal.Footer></Modal.Footer>

                    </Modal>
                </>
            }
        </>
    );
};

export default RelationshipTimeline;