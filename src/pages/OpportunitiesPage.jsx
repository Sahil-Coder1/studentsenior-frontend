import React, { useState, useEffect } from 'react';
import CollegeLinks from '../components/Links/CollegeLinks';
import Collegelink2 from '../components/Links/CollegeLink2';
import { capitalizeWords } from '../utils/Capitalize.js';
import { useParams } from 'react-router-dom';
import { api } from '../config/apiConfiguration.js';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useApiFetch from '../hooks/useApiFetch.js';
import useApiRequest from '../hooks/useApiRequest.js';
import { useCollegeId } from '../hooks/useCollegeId.js';
import { fetchGetOpportunity } from '../redux/slices/getOpportunitySlice.js';
import { fetchGiveOpportunity } from '../redux/slices/giveOpportunitySlice.js';
import useRequireLogin from '../hooks/useRequireLogin.js';

const OpportunitiesPage = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const requireLogin = useRequireLogin();
    const [showGetForm, setShowGetForm] = useState(false);
    const [showGiveForm, setShowGiveForm] = useState(false);
    const [loadingStates, setLoadingStates] = useState({});
    const [newGetOpportunity, setNewGetOpportunity] = useState({
        name: '',
        description: '',
        whatsapp: '',
        email: '',
    });
    const [newGiveOpportunity, setNewGiveOpportunity] = useState({
        name: '',
        description: '',
        whatsapp: '',
        email: '',
    });
    const [editingOpportunity, setEditingOpportunity] = useState(null);
    const [editedOpportunity, setEditedOpportunity] = useState({
        name: '',
        description: '',
        whatsapp: '',
        email: '',
    });
    const [isEditing, setIsEditing] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { useFetch, loadingFetch } = useApiFetch();
    const { apiRequest, loading } = useApiRequest();
    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    const dispatch = useDispatch();
    const {
        getOpportunities,
        loading: getOpportunitiesLoading,
        error: getOpportunitiesError,
    } = useSelector((state) => state.getOpportunities);

    useEffect(() => {
        if (collegeId) {
            dispatch(fetchGetOpportunity(collegeId));
        }
    }, [collegeId, dispatch]);

    const handleGetOpportunitySubmit = async (e) => {
        e.preventDefault();

        if (!requireLogin()) return;

        if (collegeId) {
            try {
                await apiRequest(api.getOpportunity, 'POST', {
                    ...newGetOpportunity,
                    college: collegeId,
                });

                setNewGetOpportunity({
                    name: '',
                    description: '',
                    whatsapp: '',
                    email: '',
                });
                setShowGetForm(false);
                toast.success(
                    'Get Opportunity Added SuccessFully , Available Once Approved'
                );
            } catch (err) {
                console.error(err);
                toast.error(err);
            }
        } else {
            toast.error('College not found.');
        }
    };

    const handleEditClick = (opportunity) => {
        setEditingOpportunity(opportunity._id);
        setEditedOpportunity({
            name: opportunity.name,
            description: opportunity.description,
            whatsapp: opportunity.whatsapp,
            email: opportunity.email,
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleEditOpportunitySubmit = async (e) => {
        e.preventDefault();
        try {
            await apiRequest(
                `${api.getOpportunity}/${editingOpportunity}`,
                'PUT',
                editedOpportunity
            );
            dispatch(fetchGetOpportunity(collegeId));
            setEditingOpportunity(null);
            setIsModalOpen(false);
            toast.success('Get opportunity edited successfully');
        } catch (error) {
            console.error('Error updating opportunity:', error);
        }
    };

    const DeleteGetOpportunity = async (getOpportunitiesId) => {
        setLoadingStates((prev) => ({ ...prev, [getOpportunitiesId]: true }));
        try {
            await apiRequest(
                `${api.getOpportunity}/${getOpportunitiesId}`,
                'DELETE'
            );

            dispatch(fetchGetOpportunity(collegeId));

            toast.success('Get opportunity deleted successfully');
        } catch (error) {
            console.error('Error deleting Get Opportunity:', error);
        } finally {
            setLoadingStates((prev) => ({
                ...prev,
                [getOpportunitiesId]: false,
            }));
        }
    };

    const {
        giveOpportunities,
        loading: giveOpportunitiesLoading,
        error: giveOpportunitiesError,
    } = useSelector((state) => state.giveOpportunities || {});

    useEffect(() => {
        dispatch(fetchGiveOpportunity(collegeId));
    }, []);

    const handleGiveOpportunitySubmit = async (e) => {
        e.preventDefault();

        if (!requireLogin()) return;

        if (collegeId) {
            try {
                await apiRequest(`${api.giveOpportunity}`, 'POST', {
                    ...newGiveOpportunity,
                    college: collegeId,
                });

                setNewGiveOpportunity({
                    name: '',
                    description: '',
                    whatsapp: '',
                    email: '',
                });
                setShowGiveForm(false);
                toast.success(
                    'Give Opportunity Added SuccessFully , Available Once Approved'
                );
            } catch (err) {
                // toast.error(err);
                console.log(err);
            }
        } else {
            toast.error('College not found.');
        }
    };

    const handleGiveOpportunityClick = (opportunity) => {
        setEditingOpportunity(opportunity._id);
        setEditedOpportunity({
            name: opportunity.name,
            description: opportunity.description,
            whatsapp: opportunity.whatsapp,
            email: opportunity.email,
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEditGiveOpportunitySubmit = async (e) => {
        e.preventDefault();
        try {
            await apiRequest(
                `${api.giveOpportunity}/${editingOpportunity}`,
                'PUT',
                editedOpportunity
            );

            dispatch(fetchGiveOpportunity(collegeId));

            setEditingOpportunity(null);
            setIsModalOpen(false);
            toast.success('Give opportunity updated successfully');
        } catch (error) {
            console.error('Error updating opportunity:', error);
        }
    };

    const DeleteGiveOpportunity = async (giveOpportunitiesId) => {
        setLoadingStates((prev) => ({ ...prev, [giveOpportunitiesId]: true }));
        try {
            await apiRequest(
                `${api.giveOpportunity}/${giveOpportunitiesId}`,
                'DELETE'
            );

            dispatch(fetchGiveOpportunity(collegeId));

            toast.success('Give opportunity deleted successfully');
        } catch (error) {
            console.error('Error deleting Give Opportunity:', error);
        } finally {
            setLoadingStates((prev) => ({
                ...prev,
                [giveOpportunitiesId]: false,
            }));
        }
    };

    return (
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full">
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5">
                <h1 className="text-lg sm:text-3xl font-bold mb-2 text-center">
                    Opportunities - {capitalizeWords(collegeName)}
                </h1>
                <p className="italic text-center text-xs sm:text-base">
                    "Explore opportunities to work in various positions across
                    different companies."
                </p>
                <br />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Get Opportunities */}
                    <div>
                        <div className="flex justify-between items-center mb-5">
                            <button
                                onClick={() => setShowGetForm(!showGetForm)}
                                className="px-4 py-2 bg-sky-500 text-white rounded-md"
                            >
                                {showGetForm ? 'Close Form' : 'Get Opportunity'}
                            </button>
                        </div>

                        {showGetForm && (
                            <form
                                onSubmit={handleGetOpportunitySubmit}
                                className="mb-5 p-5 bg-white shadow-md rounded-md"
                            >
                                <h3 className="text-xl font-bold mb-3">
                                    Fill Your Expertise
                                </h3>

                                <input
                                    type="text"
                                    placeholder="Job Name You Needed"
                                    value={newGetOpportunity.name}
                                    onChange={(e) =>
                                        setNewGetOpportunity({
                                            ...newGetOpportunity,
                                            name: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                    required
                                />

                                <textarea
                                    placeholder="Description"
                                    value={newGetOpportunity.description}
                                    onChange={(e) =>
                                        setNewGetOpportunity({
                                            ...newGetOpportunity,
                                            description: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                    required
                                ></textarea>

                                <input
                                    type="number"
                                    placeholder="Whatsapp Number (optional)"
                                    value={newGetOpportunity.whatsapp}
                                    onChange={(e) =>
                                        setNewGetOpportunity({
                                            ...newGetOpportunity,
                                            whatsapp: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newGetOpportunity.email}
                                    onChange={(e) =>
                                        setNewGetOpportunity({
                                            ...newGetOpportunity,
                                            email: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                    required
                                />

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-sky-500 text-white rounded-md"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <i className="fa fa-spinner fa-spin"></i>
                                    ) : (
                                        <>Submit</>
                                    )}
                                </button>
                            </form>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                            {getOpportunitiesError && (
                                <div className="text-red-500 text-center">
                                    Failed to load opportunities: {error}
                                </div>
                            )}
                            {getOpportunities.length > 0 ? (
                                <>
                                    {getOpportunities.map((opportunity) => (
                                        <div
                                            key={opportunity._id}
                                            className="bg-white p-5 shadow-md rounded-md"
                                        >
                                            <h3 className="mb-2">
                                                <strong>Job Name :</strong>{' '}
                                                {opportunity.name}
                                            </h3>
                                            <div className="bg-gray-100 mb-2 rounded-md max-h-40 sm:h-40">
                                                <p className="p-2 h-full overflow-scroll">
                                                    {opportunity.description}
                                                </p>
                                            </div>
                                            <div className="flex gap-4">
                                                <a
                                                    href={`https://api.whatsapp.com/send?phone=${opportunity.whatsapp}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <button className="py-2 px-1 sm:px-4 bg-sky-500 hover:bg-blue-500 text-white rounded-md">
                                                        Hire Me{' '}
                                                    </button>
                                                </a>
                                                <a
                                                    href={`mailto:${opportunity.email}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <button className="py-2 px-1 sm:px-4 bg-sky-500 hover:bg-blue-500 text-white rounded-md">
                                                        Email Me
                                                    </button>
                                                </a>
                                                {opportunity.owner._id ===
                                                    ownerId && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleEditClick(
                                                                    opportunity
                                                                )
                                                            }
                                                            className="sm:px-4 p-2 bg-yellow-500 hover:bg-yellow-200 text-white rounded-md ml-2"
                                                        >
                                                            <i className="fa-regular fa-pen-to-square"></i>
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                DeleteGetOpportunity(
                                                                    opportunity._id
                                                                )
                                                            }
                                                            className="sm:px-4 p-2 bg-red-500 hover:bg-red-200 text-white rounded-md"
                                                            disabled={
                                                                loadingStates[
                                                                    opportunity
                                                                        ._id
                                                                ]
                                                            }
                                                        >
                                                            {loadingStates[
                                                                opportunity._id
                                                            ] ? (
                                                                <i className="fa fa-spinner fa-spin"></i>
                                                            ) : (
                                                                <i className="fa-solid fa-trash"></i>
                                                            )}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="flex justify-center items-center min-h-screen">
                                    {loading ? (
                                        <i className="fas fa-spinner fa-pulse fa-5x"></i>
                                    ) : (
                                        <div className="flex justify-center">
                                            No Get Opportunity Found{' '}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={
                            isEditing
                                ? handleEditOpportunitySubmit
                                : handleEditGiveOpportunitySubmit
                        }
                    >
                        <h3 className="text-xl font-bold mb-3">
                            {isEditing
                                ? 'Edit Opportunity'
                                : 'Give Opportunity'}
                        </h3>
                        <input
                            type="text"
                            placeholder="Job Name"
                            value={editedOpportunity.name}
                            onChange={(e) =>
                                setEditedOpportunity({
                                    ...editedOpportunity,
                                    name: e.target.value,
                                })
                            }
                            className="p-2 border rounded-md mb-3 w-full"
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={editedOpportunity.description}
                            onChange={(e) =>
                                setEditedOpportunity({
                                    ...editedOpportunity,
                                    description: e.target.value,
                                })
                            }
                            className="p-2 border rounded-md mb-3 w-full"
                            required
                        ></textarea>
                        <input
                            type="number"
                            placeholder="Whatsapp Number (optional)"
                            value={editedOpportunity.whatsapp}
                            onChange={(e) =>
                                setEditedOpportunity({
                                    ...editedOpportunity,
                                    whatsapp: e.target.value,
                                })
                            }
                            className="p-2 border rounded-md mb-3 w-full"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editedOpportunity.email}
                            onChange={(e) =>
                                setEditedOpportunity({
                                    ...editedOpportunity,
                                    email: e.target.value,
                                })
                            }
                            className="p-2 border rounded-md mb-3 w-full"
                            required
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-sky-500 text-white rounded-md"
                            disabled={loading}
                        >
                            {loading ? (
                                <i className="fa fa-spinner fa-spin"></i>
                            ) : (
                                <>Update</>
                            )}
                        </button>
                    </Modal>

                    {/* Right Column: Give Opportunities */}
                    <div>
                        <div className="flex justify-between items-center mb-5">
                            <button
                                onClick={() => setShowGiveForm(!showGiveForm)}
                                className="px-4 py-2 bg-green-500 text-white rounded-md"
                            >
                                {showGiveForm
                                    ? 'Close Form'
                                    : 'Give Opportunity'}
                            </button>
                        </div>
                        {showGiveForm && (
                            <form
                                onSubmit={handleGiveOpportunitySubmit}
                                className="mb-5 p-5 bg-white shadow-md rounded-md"
                            >
                                <h3 className="text-xl font-bold mb-3">
                                    Fill the Job You Provide
                                </h3>

                                <input
                                    type="text"
                                    placeholder="Job Name You Provide"
                                    value={newGiveOpportunity.name}
                                    onChange={(e) =>
                                        setNewGiveOpportunity({
                                            ...newGiveOpportunity,
                                            name: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                    required
                                />

                                <textarea
                                    placeholder="Description"
                                    value={newGiveOpportunity.description}
                                    onChange={(e) =>
                                        setNewGiveOpportunity({
                                            ...newGiveOpportunity,
                                            description: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                    required
                                ></textarea>

                                <input
                                    type="number"
                                    placeholder="Whatsapp Number (optional)"
                                    value={newGiveOpportunity.whatsapp}
                                    onChange={(e) =>
                                        setNewGiveOpportunity({
                                            ...newGiveOpportunity,
                                            whatsapp: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newGiveOpportunity.email}
                                    onChange={(e) =>
                                        setNewGiveOpportunity({
                                            ...newGiveOpportunity,
                                            email: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                    required
                                />

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-sky-500 text-white rounded-md"
                                >
                                    Submit
                                </button>
                            </form>
                        )}
                        <div className="grid grid-cols-1 gap-6">
                            {giveOpportunitiesError && (
                                <div className="text-red-500 text-center">
                                    Failed to load opportunities: {error}
                                </div>
                            )}
                            {giveOpportunities.length > 0 ? (
                                <>
                                    {giveOpportunities.map((opportunity) => (
                                        <div
                                            key={opportunity._id}
                                            className="bg-white p-5 shadow-md rounded-md"
                                        >
                                            <h3 className="mb-2">
                                                <strong>Job Name :</strong>{' '}
                                                {opportunity.name}
                                            </h3>
                                            <div className="bg-gray-100 mb-2 rounded-md max-h-40 sm:h-40">
                                                <p className="p-2 h-full overflow-scroll">
                                                    {opportunity.description}
                                                </p>
                                            </div>
                                            <div className="flex gap-4">
                                                <a
                                                    href={`https://api.whatsapp.com/send?phone=${opportunity.whatsapp}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <button className="py-2 px-1 sm:px-4 bg-sky-500 hover:bg-blue-500 text-white rounded-md">
                                                        Contact Us{' '}
                                                    </button>
                                                </a>
                                                <a
                                                    href={`mailto:${opportunity.email}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <button className="py-2 px-1 sm:px-4 bg-sky-500 hover:bg-blue-500 text-white rounded-md">
                                                        Email Us
                                                    </button>
                                                </a>
                                                {opportunity.owner._id ===
                                                    ownerId && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleGiveOpportunityClick(
                                                                    opportunity
                                                                )
                                                            }
                                                            className="sm:px-4 p-2 bg-yellow-500 hover:bg-yellow-200 text-white rounded-md ml-2"
                                                        >
                                                            <i className="fa-regular fa-pen-to-square"></i>
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                DeleteGiveOpportunity(
                                                                    opportunity._id
                                                                )
                                                            }
                                                            className="sm:px-4 p-2 bg-red-500 hover:bg-red-200 text-white rounded-md"
                                                            disabled={
                                                                loading[
                                                                    opportunity
                                                                        ._id
                                                                ]
                                                            }
                                                        >
                                                            {loadingStates[
                                                                opportunity._id
                                                            ] ? (
                                                                <i className="fa fa-spinner fa-spin"></i>
                                                            ) : (
                                                                <i className="fa-solid fa-trash"></i>
                                                            )}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="flex justify-center items-center min-h-screen">
                                    {giveOpportunitiesLoading ? (
                                        <i className="fas fa-spinner fa-pulse fa-5x"></i>
                                    ) : (
                                        <p>
                                            No Opportunity available at the
                                            moment.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
            <Collegelink2 />
        </div>
    );
};

const Modal = ({ isOpen, onClose, onSubmit, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 float-right"
                >
                    &times;
                </button>
                <form onSubmit={onSubmit} className="p-5">
                    {children}
                </form>
            </div>
        </div>
    );
};

export default OpportunitiesPage;
