import React, { useState } from "react";  
import { read, utils, writeFile } from 'xlsx';

const HomeComponent = () => {
    const [scores, setScores] = useState([]);

    const handleImport = ($event) => {
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    setScores(rows)
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }

    const handleExport = () => {
        const headings = [[
            'Program',
            'Facility',
            'Assessment_Date',
            'Assessment_Lead',
            'SET',
            'CEE',
            'Score',
            'Comments'
        ]];
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, scores, { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Movie Report.xlsx');
    }

    return (
        <>
            <div className="row mb-2 mt-5">
                <div className="col-sm-6 offset-3">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="input-group">
                                <div className="custom-file">
                                    <input type="file" name="file" className="custom-file-input" id="inputGroupFile" required onChange={handleImport}
                                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                                    <label className="custom-file-label" htmlFor="inputGroupFile">Choose file</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <button onClick={handleExport} className="btn btn-primary float-right">
                                Export <i className="fa fa-download"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6 offset-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Program</th>
                                <th scope="col">Facility</th>
                                <th scope="col">Assessment_Date</th>
                                <th scope="col">Assessment_Lead</th>
                                <th scope="col">SET</th>
                                <th scope="col">CEE</th>
                                <th scope="col">Score</th>
                                <th scope="col">Comments</th>
                                
                            </tr>
                        </thead>
                        <tbody> 
                                {
                                    scores.length
                                    ?
                                    scores.map((score, index) => (
                                        <tr key={index}>
                                            <th scope="row">{ index + 1 }</th>
                                            <td>{ score.County }</td>
                                            <td>{ score.Facility }</td>
                                            <td>{ score.Assessment_Date }</td>
                                            <td>{ score.Assessment_Lead }</td>
                                            <td>{ score.SET }</td>
                                            <td>{ score.CEE }</td>
                                            <td>{ score.Score }</td>
                                            <td><span className="badge bg-warning text-dark">{ score.Comments }</span></td>
                                        </tr> 
                                    ))
                                    :
                                    <tr>
                                        <td colSpan="5" className="text-center">No Reports Found.</td>
                                    </tr> 
                                }
                        </tbody>
                    </table>
                </div>
            </div>
        </>

    );
};

export default HomeComponent;
