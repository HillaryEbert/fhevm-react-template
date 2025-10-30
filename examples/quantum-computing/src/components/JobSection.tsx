import { useState } from 'react';
import './JobSection.css';

interface JobSectionProps {
  call: (method: string, args: any[]) => Promise<any>;
  setStatus: (status: string) => void;
}

export default function JobSection({ call, setStatus }: JobSectionProps) {
  const [jobId, setJobId] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [jobInfo, setJobInfo] = useState<any>(null);

  const handleQuery = async () => {
    if (!jobId) {
      setStatus('❌ Please enter a job ID');
      return;
    }

    try {
      setIsQuerying(true);
      setStatus('Querying job information...');

      const info = await call('getJobInfo', [jobId]);

      setJobInfo({
        owner: info[0],
        algorithmType: info[1],
        completed: info[2],
        verified: info[3],
        timestamp: new Date(info[4] * 1000).toLocaleString(),
      });

      setStatus('✅ Job information retrieved!');
    } catch (error) {
      setStatus('❌ Error: ' + (error as Error).message);
      setJobInfo(null);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="card">
      <h2>📊 Query Job Status</h2>
      <p className="description">
        Check the status of a submitted quantum computation job
      </p>

      <div className="form-group">
        <label>Job ID:</label>
        <input
          type="number"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          placeholder="Enter job ID"
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={handleQuery}
        disabled={isQuerying}
      >
        {isQuerying ? (
          <>
            <span className="loading-spinner"></span>
            Querying...
          </>
        ) : (
          'Query Job'
        )}
      </button>

      {jobInfo && (
        <div className="job-info fade-in">
          <h3>Job Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Owner:</span>
              <code>{jobInfo.owner?.slice(0, 10)}...{jobInfo.owner?.slice(-8)}</code>
            </div>
            <div className="info-item">
              <span className="info-label">Algorithm Type:</span>
              <span>{jobInfo.algorithmType}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Completed:</span>
              <span className={jobInfo.completed ? 'status-yes' : 'status-no'}>
                {jobInfo.completed ? '✅ Yes' : '⏳ No'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Verified:</span>
              <span className={jobInfo.verified ? 'status-yes' : 'status-no'}>
                {jobInfo.verified ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Timestamp:</span>
              <span>{jobInfo.timestamp}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
