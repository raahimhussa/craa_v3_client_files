export type DataDumpGroup = {
  client: {
    _id: string;
    label: string;
    businessUnits: {
      _id: string;
      label: string;
      businessCycles: {
        _id: string;
        _label: string;
        assessmentTypes: {
          _id: string;
          label: string;
          baseline: {
            // simulation
            _id: string;
            label: string;
          };
          followups: {
            _id: string;
            label: string;
          }[];
        };
      };
    };
  };
};

export type ScoreBySeverity = {
  severity: number;
  mean: number;
  high: number;
  low: number;
}[];

export type ScoreByMainDomain = {
  domain: {
    _id: string;
    label: string;
  };
  mean: number;
}[];

// number = seconds
export type TotalTimeToComplete = {
  mean: number;
  high: number;
  low: number;
};

//export type MedicineScore = {
//	severity: number;
//	mean: number;
//	high: number;
//	low: number;
//}[]

export type ScoreByFinding = {
  finding: {
    _id: string;
    label: string;
  };
  severity: number;
  domain: {
    _id: string;
    label: string;
  };
  identifiedFindingUserId: string[];
  countIdentified: number;
  percentOfIdentifiedFindings: number;
}[];

export type OverallDataByUser = {
  user: {
    _id: string;
    label: string;
    status: string;
    title: string;
    country: string;
    vender: string;
    businessUnit: {
      _id: string;
      label: string;
    };
    region: string;
    experience: number;
    clinicalExperience: number;
    // intDev
    // type
    degree: string;
    certification: string[];
    manager: boolean;
  };
  baseline: {
    userSimulation: {
      _id: string;
      label: string;
      status: string;
      unusualBehavior: boolean;
      minimumEffort: boolean;
    };
    scoreByDomain: {
      domain: {
        _id: string;
        label: string;
      };
      percentOfIdentifiedFindings: number;
    }[];
    scoreByMainDomain: {
      domain: {
        _id: string;
        label: string;
      };
      percentOfIdentifiedFindings: number;
    }[];
    percentOfIdentifiedFindingsDomainTotal: number;
    percentOfIdentifiedFindingsBySeverity: {
      severity: number;
      score: number;
    };
    medicineScore: any;
    assignedTrainingModuleCount: number;
    testTime: number;
  };
  followups: {
    userSimulation: {
      _id: string;
      label: string;
      status: string;
      unusualBehavior: boolean;
      minimumEffort: boolean;
    };
    percentOfIdentifiedFindings: number;
  }[];
  trainings: {
    userTraining: {
      _id: string;
      label: string;
      status: string;
      unusualBehavior: boolean;
      minimumEffort: boolean;
    };
    // scores, difference
  }[];
  grade: string;
}[];
