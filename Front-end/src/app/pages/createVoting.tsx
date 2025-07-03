export interface Participant {
  name: string;
  userId: string;
  _id: string;
  joinedAt: string;
}

export interface Room {
  _id: string;
  title: string;
  description: string;
  maxParticipants: number;
  creatorId: {
    _id: string;
    userName: string;
    email: string;
  };
  roomCode: string;
  inviteLink: string;
  isOpen: boolean;
  createdAt: string;
  participants: Participant[];
}

import { useState } from 'react';
import { Plus, X, Clock, Calendar } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetParticipantQuery } from '@/api/get-Participant';
import { useCreateVoteMutation } from '@/api/create-vote';

export const RoomView = ({ roomCode: propRoomCode }: { roomCode?: string }) => {
  const { roomCode: routeRoomCode } = useParams({ strict: false });
  const roomCode = propRoomCode ?? routeRoomCode;

  console.log('=== RoomView Debug Info ===');
  console.log('propRoomCode:', propRoomCode);
  console.log('routeRoomCode:', routeRoomCode);
  console.log('final roomCode:', roomCode);

  const [formData, setFormData] = useState({
    title: '',
    options: ['', ''],
    duration: {
      days: 1,
      hours: 0,
      minutes: 0,
    },
  });

  const navigate = useNavigate();
  const [createVote, { isLoading: isCreating }] = useCreateVoteMutation();

  //getting participants
  const {
    data: participantNames,
    isLoading,
    error,
  } = useGetParticipantQuery({ roomCode });

  // Get only participant names
  // const participantNames = roomData?.map((p) => p.name) ?? [];

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData({ ...formData, options: updatedOptions });
  };

  const addOptionField = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const removeOptionField = (index: number) => {
    const updatedOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleDurationChange = (type: string, value: string) => {
    setFormData({
      ...formData,
      duration: {
        ...formData.duration,
        [type]: parseInt(value) || 0,
      },
    });
  };

  const getTotalMinutes = () => {
    const { days, hours, minutes } = formData.duration;
    return days * 24 * 60 + hours * 60 + minutes;
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a poll title');
      return;
    }

    const validOptions = formData.options.filter((opt) => opt.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    const payload = {
      title: formData.title,
      options: validOptions,
      duration: formData.duration,
      roomCode: roomCode ?? undefined,
    };

    try {
      const response = await createVote(payload).unwrap();
      alert('Voting room created successfully!');
      setFormData({
        title: '',
        options: ['', ''],
        duration: { days: 1, hours: 0, minutes: 0 },
      });
      navigate({ to: '/voting-room/$id', params: { id: response.vote._id } });
    } catch (err) {
      console.error('Error creating vote:', err);
      alert('Failed to create vote');
    }
  };

  const formatDuration = () => {
    const { days, hours, minutes } = formData.duration;
    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(', ') : '0 minutes';
  };

  if (isLoading) return <div>Loading participants...</div>;
  // if (isError) {
  //   console.error('API Error:', error);
  //   return (
  //     <div>
  //       <div>Failed to load participants.</div>
  //       <div style={{ fontSize: '12px', color: 'red', marginTop: '10px' }}>
  //         Debug: {JSON.stringify(error, null, 2)}
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4'>
      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Left Side: Participants */}
        <div className='md:col-span-1'>
          <div className='bg-white p-6 rounded-3xl shadow-xl border border-gray-100'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>
              Participants
            </h2>

            {isLoading ? (
              <p className='text-sm text-gray-500'>Loading participants...</p>
            ) : error ? (
              <div className='text-sm text-red-500'>
                Failed to load participants.
              </div>
            ) : participantNames && participantNames.length > 0 ? (
              <ul className='list-disc list-inside text-sm text-gray-700 space-y-1'>
                {participantNames.map((name, index) => (
                  <li key={index}>{name || 'Unnamed'}</li>
                ))}
              </ul>
            ) : (
              <p className='text-sm text-yellow-600'>No participants found.</p>
            )}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className='md:col-span-2'>
          <div className='bg-white p-8 rounded-3xl shadow-2xl border border-gray-100'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4'>
                <Calendar className='w-8 h-8 text-white' />
              </div>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                Create Voting Room
              </h1>
              <p className='text-gray-600'>
                Set up your poll with custom duration
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className='space-y-8'
            >
              {/* Title */}
              <div>
                <label className='block text-sm font-semibold mb-3 text-gray-700'>
                  Poll Title
                </label>
                <input
                  type='text'
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder='What would you like to ask?'
                  className='w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200'
                  required
                />
              </div>

              {/* Voting Options */}
              <div>
                <label className='block text-sm font-semibold mb-3 text-gray-700'>
                  Voting Options
                </label>
                <div className='space-y-3'>
                  {formData.options.map((option, index) => (
                    <div key={index} className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold'>
                        {index + 1}
                      </div>
                      <input
                        type='text'
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        className='flex-1 border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-200'
                        required
                      />
                      {formData.options.length > 2 && (
                        <button
                          type='button'
                          onClick={() => removeOptionField(index)}
                          className='flex items-center justify-center w-10 h-10 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200'
                          title='Remove Option'
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type='button'
                  onClick={addOptionField}
                  className='flex items-center gap-2 text-indigo-600 mt-4 text-sm font-medium hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all duration-200'
                >
                  <Plus size={18} /> Add another option
                </button>
              </div>

              {/* Voting Duration */}
              <div className='bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100'>
                <div className='flex items-center gap-2 mb-4'>
                  <Clock className='w-5 h-5 text-indigo-600' />
                  <label className='text-sm font-semibold text-gray-700'>
                    Voting Duration
                  </label>
                </div>

                <div className='grid grid-cols-3 gap-4 mb-4'>
                  {['days', 'hours', 'minutes'].map((unit) => (
                    <div key={unit}>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                      </label>
                      <select
                        value={
                          formData.duration[
                            unit as keyof typeof formData.duration
                          ]
                        }
                        onChange={(e) =>
                          handleDurationChange(unit, e.target.value)
                        }
                        className='w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200'
                      >
                        {Array.from(
                          {
                            length:
                              unit === 'minutes'
                                ? 60
                                : unit === 'hours'
                                  ? 24
                                  : 31,
                          },
                          (_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  ))}
                </div>

                <div className='text-center'>
                  <span className='text-sm text-gray-600'>
                    Total duration:{' '}
                  </span>
                  <span className='text-sm font-semibold text-indigo-600'>
                    {formatDuration()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform'
              >
                {isCreating ? 'Creating...' : 'Create Voting Room'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
