import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { Project } from "../projects/project.entity";

@Entity()
export class LogEntry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({  type: "text", default: "common" })
    logType: string;

    @Column({  type: "text", default: "common" })
    logAction: string;

    @Column({  type: "text", default: "" })
    message: string;

    @Column('jsonb', {nullable: true})
    metadata?: object;

    @Column({ type: "timestamp"})
    created: Date;

    @Column({ type: "timestamp", nullable: true })
    updated?: Date;

}