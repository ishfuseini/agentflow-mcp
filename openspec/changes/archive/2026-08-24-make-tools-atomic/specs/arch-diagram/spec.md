## ADDED Requirements

### Requirement: Architecture diagram generation as a separate tool

The system SHALL provide a dedicated `arch_diagram` tool that accepts a `pattern_id` and optional data stack, and returns structured `diagram_data` (components, connections, boundaries) that an agent's architecture-diagram skill can render. Diagram generation SHALL NOT be part of the `arch_pattern_lookup` response. This tool is independent and can be called at any time; it does not require `arch_pattern_lookup` to be called first.

#### Scenario: Diagram for a curated pattern

- **WHEN** the tool receives pattern_id "media_agency_audience_measurement" and data stack ["BigQuery", "Snowflake"]
- **THEN** the system returns a diagram_data object with a components array (each with name, type, sublabel, and zone), a connections array (each with from, to, label, and style), and a boundaries array (each with label and type)

#### Scenario: Diagram for the fallback pattern

- **WHEN** the tool receives a pattern_id that maps to the generic enterprise AI POC fallback pattern
- **THEN** the system returns a diagram_data object reflecting the generic governed-data-landing + LLM-gateway + HITL pattern, or a graceful response indicating no detailed diagram is available for the generic pattern

#### Scenario: Unknown pattern id

- **WHEN** the tool receives a pattern_id not present in the source pack
- **THEN** the system returns a graceful unavailable response indicating no diagram could be generated, without causing a tool error

### Requirement: Structured JSON output

The system SHALL return a JSON object containing pattern_id and diagram_data for successful diagram generation.

#### Scenario: Response schema compliance

- **WHEN** the tool returns a successful diagram generation
- **THEN** the response includes pattern_id (string) and diagram_data (object with components, connections, and boundaries arrays)

#### Scenario: Unavailable response schema

- **WHEN** the tool returns a graceful unavailable response
- **THEN** the response indicates the diagram could not be generated without causing a tool error