import React, {Component} from 'react';
import ResultsList from './ResultsList';

class Results extends Component{
    render() {
        const {results, isFetchingResults} = this.props;
        const{
            paths,
            sourcePageTitle,
            targetPageTitle,
            isSourceRedirected,
            isTargetRedirected,
            durationInSeconds,
        } = results;
        if(paths==null || isFetchingResults){
            return null;
        }

        <ResultsList paths={paths}/>
        

    }
}

export default Results;